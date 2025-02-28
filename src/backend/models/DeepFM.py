import numpy as np
import pandas as pd
import pickle
from tensorflow.keras.models import load_model

save_folder_path = "../../data/processed_data/DeepFM/"

# Load the DeepFM model
DeepFM_model = load_model(save_folder_path + 'DeepFM.keras')

# Load the saved label encoders
with open(save_folder_path + 'user_id_encoder.pkl', 'rb') as f:
    DeepFM_user_id_encoder = pickle.load(f)

with open(save_folder_path + 'business_id_encoder.pkl', 'rb') as f:
    DeepFM_business_id_encoder = pickle.load(f)

# Load the saved scalers
with open(save_folder_path + 'user_scaler.pkl', 'rb') as f:
    DeepFM_user_scaler = pickle.load(f)

with open(save_folder_path + 'business_scaler.pkl', 'rb') as f:
    DeepFM_business_scaler = pickle.load(f)

def DeepFM_rank_top_k(DeepFM_model, user_id, business_ids, user_info, business_info, user_id_encoder, business_id_encoder, user_scaler, business_scaler, k=1000):

    encoded_user_id = user_id_encoder.transform([user_id])[0]
    user_continuous_features = ['review_count', 'useful', 'funny', 'cool', 'fans', 'average_stars']
    user_compliments = ['hot', 'more', 'profile', 'cute', 'list', 'note', 'plain', 'cool', 'funny', 'writer', 'photos']

    user_data_list = []

    for user_id in user_info:
        # Extract continuous features
        user_features = [user_info[user_id].get(feat, 0) for feat in user_continuous_features]
        
        # One-hot encode compliments
        user_compliments_vector = [1 if c in user_info[user_id].get('compliments', []) else 0 for c in user_compliments]
        
        # Combine into a single row
        user_data_list.append(user_features + user_compliments_vector)

    # Convert to DataFrame
    user_continuous_features = pd.DataFrame(user_data_list, 
                                            columns=user_continuous_features + [f'compliment_{c}' for c in user_compliments])

    # Scale continuous features
    user_continuous_features = pd.DataFrame(user_scaler.transform(user_continuous_features), 
                                            columns=user_continuous_features.columns)
    
    encoded_business_ids = business_id_encoder.transform(business_ids)

    # later_features = ["name", "address", "city", "state", "postal_code",]
    business_continuous_features = ["latitude", "longitude", "stars", 
    "review_count"]

    business_data_list = []
    for business_id in business_info:
        # Extract continuous features
        business_features = [business_info[business_id].get(feat, 0) for feat in business_continuous_features]

        total_reviews = 0
        for review in business_info[business_id]['reviews']:
            total_reviews += review['stars']

        # Calculate average review
        if len(business_info[business_id]['reviews']) > 0:
            avg_review = total_reviews / len(business_info[business_id]['reviews'])
        else:
            avg_review = 0
        # Combine into a single row
        business_data_list.append(business_features + [avg_review])

    business_continuous_features += ["avg_review"]

    # Convert to DataFrame
    business_continuous_features = pd.DataFrame(business_data_list, 
                                                columns=business_continuous_features)

    ordered_business_continuous_features = ["stars", "review_count", "avg_review", "latitude", "longitude",] 

    business_continuous_features = business_continuous_features[ordered_business_continuous_features]

    # Scale continuous features and reorder columns
    business_continuous_features = pd.DataFrame(business_scaler.transform(business_continuous_features), 
                                                columns=ordered_business_continuous_features)
    # combine user and business features into one dataframe (there is only one user and maybe multiple businesses)
    user_features = np.repeat(user_continuous_features.values, len(business_continuous_features), axis=0)
    business_features = np.tile(business_continuous_features.values, (len(user_continuous_features), 1))
    all_features = np.concatenate([user_features, business_features], axis=1)

    # get the user_ids and business_ids in the right format (i.e. -1, 1)
    user_ids = np.repeat(encoded_user_id, len(encoded_business_ids)).reshape(-1, 1)
    business_ids = np.array(encoded_business_ids).reshape(-1, 1)

    # make the prediction
    predictions = DeepFM_model.predict([all_features, user_ids, business_ids])

    # get the predictions
    predictions = predictions.flatten()

    # convert the prediction to float instead of numpy.float32
    predictions = [float(prediction) for prediction in predictions]

    # decode the business_ids
    decoded_business_ids = business_id_encoder.inverse_transform(encoded_business_ids)

    # combine the business_ids and predictions and sort by predictions
    recommended_businesses = list(zip(decoded_business_ids, predictions))
    recommended_businesses.sort(key=lambda x: x[1], reverse=True)
    return recommended_businesses[:k]
    



