import sqlite3
import pickle
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder, StandardScaler, normalize
from sklearn.metrics import roc_auc_score, precision_score, recall_score, confusion_matrix
from sklearn.utils import shuffle

import tensorflow as tf
from tensorflow.keras import layers, Model
from tensorflow.keras.layers import Input, Layer, Lambda
from tensorflow.keras.preprocessing.sequence import pad_sequences
from tensorflow.keras.models import load_model

MAX_CATEGORY_LENGTH = 5

# Define the database folder path and file names
db_folder = '../../data/processed_data/yelp_data/'

# Connect to the databases and load data
def load_data_from_db(db_files = ['yelp_business_data.db', 'yelp_review_data.db', 'yelp_user_data.db', 'yelp_tip_data.db']):
    db_paths = [db_folder + db_file for db_file in db_files]
    # Load data from the databases
    data = {}
    
    # Open connections and read tables
    conns = [sqlite3.connect(db_path) for db_path in db_paths]
    conns_count = 0
    try:
        if 'yelp_business_data.db' in db_files:
            data['business_details'] = pd.read_sql_query("SELECT * FROM business_details", conns[conns_count])
            data['business_categories'] = pd.read_sql_query("SELECT * FROM business_categories", conns[conns_count])
            conns_count += 1
        if 'yelp_review_data.db' in db_files:
            data['review'] = pd.read_sql_query("SELECT * FROM review_data", conns[conns_count])
            conns_count += 1
        if 'yelp_user_data.db' in db_files:
            data['user'] = pd.read_sql_query("SELECT * FROM user_data", conns[conns_count])
            conns_count += 1
        if 'yelp_tip_data.db' in db_files:
            data['tip'] = pd.read_sql_query("SELECT * FROM tip_data", conns[conns_count])
            conns_count += 1
        
    finally:
        # Close all database connections
        for conn in conns:
            conn.close()

    return data

# Load data into a dictionary
yelp_data = load_data_from_db()

# Check loaded data
for table, df in yelp_data.items():
    print(f"Loaded {len(df)} rows from {table} table.")


user_con_feature_lst = [
                        'review_count', 
                        'useful', 
                        'funny', 
                        'cool', 
                        'fans', 
                        'average_stars'
                        ]
business_con_feature_lst = [
                        'stars', 
                        'review_count', 
                        'avg_review',
                        'latitude', 
                        'longitude'   
                        ]

# add user features that start with 'compliment_'
user_compliment_feature_lst = [col for col in yelp_data['user'].columns if 'compliment_' in col]
user_con_feature_lst += user_compliment_feature_lst


# Preprocess user data
user_df = yelp_data['user']
user_df['yelping_since'] = pd.to_datetime(user_df['yelping_since'])

# Preprocess business data
business_df = yelp_data['business_details']
business_df['is_open'] = business_df['is_open'].fillna(0).astype(int)

# Preprocess review data
review_df = yelp_data['review']
# Create labels for review data
review_df['label'] = (review_df['stars'] >= 4).astype(int)

# Preprocess tip data
tip_df = yelp_data['tip']

# Preprocess categories data
categories_df = yelp_data['business_categories']

# Flatten all categories into a single list to fit the encoder
unique_categories = set([cat for sublist in categories_df['category'] for cat in sublist])    

def assign_default_ids(user_df, business_df, default_user_id, default_business_id, user_fraction=0.05, business_fraction=0.05, random_state=42):
    """
    Randomly masks some user and business IDs as default values.
    """
    np.random.seed(random_state)
    
    # Randomly select a fraction of users and businesses to replace with default
    masked_users = np.random.choice(user_df['user_id'], size=int(user_fraction * len(user_df)), replace=False)
    # masked_businesses = np.random.choice(business_df['business_id'], size=int(business_fraction * len(business_df)), replace=False)
    
    user_df.loc[user_df['user_id'].isin(masked_users), 'user_id'] = default_user_id
    # business_df.loc[business_df['business_id'].isin(masked_businesses), 'business_id'] = default_business_id
    
    # return user_df, business_df
    return user_df

def prepare_data(user_df, business_df, review_df, categories_df, user_id_encoder, business_id_encoder, categories_encoder, user_scaler, business_scaler, use_stage='train', default_user_id='default_user', default_business_id='default_business'):
    if use_stage == 'train':
        # user_df, business_df = assign_default_ids(user_df, business_df, default_user_id, default_business_id)
        


        # user_df = assign_default_ids(user_df, business_df, default_user_id, default_business_id)

        all_user_ids = pd.concat([user_df["user_id"], review_df["user_id"]]).unique()
        user_id_encoder.fit(all_user_ids.reshape(-1, 1))
        all_business_ids = pd.concat([business_df["business_id"], review_df["business_id"]]).unique()
        business_id_encoder.fit(all_business_ids.reshape(-1, 1))


    categories_df['category_encoded'] = categories_encoder.transform(categories_df['category'])
    categories_df = categories_df.groupby('business_id')['category_encoded'].apply(list).reset_index()
    business_df = business_df.merge(categories_df, on='business_id', how='left')
    business_df['category_encoded'] = business_df['category_encoded'].apply(lambda x: x if isinstance(x, list) else [])

    business_avg_review = review_df.groupby('business_id')['stars'].mean()
    business_df = business_df.merge(business_avg_review.rename('avg_review'), on='business_id', how='left').fillna({'avg_review': 0})
    
    if use_stage == 'train':
        user_df['user_id_encoded'] = user_id_encoder.transform(user_df['user_id'])
        business_df['business_id_encoded'] = business_id_encoder.transform(business_df['business_id'])
        num_users = user_df['user_id_encoded'].max() + 1
        num_businesses = business_df['business_id_encoded'].max() + 1
    else:
        # user_df['user_id_encoded'] = user_id_encoder.transform(user_df['user_id'])
        business_df['business_id_encoded'] = business_id_encoder.transform(business_df['business_id'])
        num_users = len(user_id_encoder.classes_)
        num_businesses = len(business_id_encoder.classes_)

    num_categories = len(categories_encoder.classes_)

    user_continuous_features_scaled = pd.DataFrame(user_scaler.fit_transform(user_df[user_con_feature_lst].fillna(user_df[user_con_feature_lst].median())), index=user_df.index)
    business_continuous_features_scaled = pd.DataFrame(business_scaler.fit_transform(business_df[business_con_feature_lst].fillna(business_df[business_con_feature_lst].median())), index=business_df.index)

    # Filter out reviews for businesses that are not in the training set
    review_df = review_df[review_df['business_id'].isin(business_id_encoder.classes_)]
    if use_stage == 'train':
        review_df['user_id_encoded'] = user_id_encoder.transform(review_df['user_id'])
    review_df['business_id_encoded'] = business_id_encoder.transform(review_df['business_id'])

    return user_df, business_df, review_df, user_continuous_features_scaled, business_continuous_features_scaled, num_users, num_businesses, num_categories

class CategoryPoolingLayer(Layer):
    def __init__(self, **kwargs):
        super(CategoryPoolingLayer, self).__init__(**kwargs)

    def call(self, inputs):
        return tf.reduce_mean(inputs, axis=1)
    

def load_saved_models(save_folder_path='Saved_Triplet_Hinge_Loss/'):
    # Load the saved models
    user_model = load_model(save_folder_path + 'user_model.keras')
    item_model = load_model(save_folder_path + 'item_model.keras',                
            custom_objects={'CategoryPoolingLayer': CategoryPoolingLayer}
        )

    # Load the saved label encoders
    with open(save_folder_path + 'user_id_encoder.pkl', 'rb') as f:
        user_id_encoder = pickle.load(f)

    with open(save_folder_path + 'business_id_encoder.pkl', 'rb') as f:
        business_id_encoder = pickle.load(f)

    with open(save_folder_path + 'categories_encoder.pkl', 'rb') as f:
        categories_encoder = pickle.load(f)

    # Load the saved scalers
    with open(save_folder_path + 'user_scaler.pkl', 'rb') as f:
        user_scaler = pickle.load(f)

    with open(save_folder_path + 'business_scaler.pkl', 'rb') as f:
        business_scaler = pickle.load(f)

    # Load the saved user and business continuous features (temporal)
    # with open(save_folder_path + 'user_continuous_features_scaled.pkl', 'rb') as f:
    #     user_continuous_features_scaled = pickle.load(f)
    
    # with open(save_folder_path + 'business_continuous_features_scaled.pkl', 'rb') as f:
    #     business_continuous_features_scaled = pickle.load(f)
        

    return user_model, item_model, user_id_encoder, business_id_encoder, categories_encoder, user_scaler, business_scaler, 
# user_continuous_features_scaled, business_continuous_features_scaled