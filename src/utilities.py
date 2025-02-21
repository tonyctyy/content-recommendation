import sqlite3
import pickle
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split

# Connect to the databases and load data
def load_data_from_db(db_folder, data_files):
    db_files = {}
    if "business" or "categories" in data_files:
        db_files['business'] = 'yelp_business_data.db'
    if "review" in data_files:
        db_files['review'] = 'yelp_review_data.db'

    conns = {}
    for key, value in db_files.items():
        db_path = db_folder + value
        conns[key] = sqlite3.connect(db_path)

    data = {}
    try:
        if "business" in data_files:
            data['business'] = pd.read_sql_query("SELECT * FROM business_details", conns['business'])
        if "categories" in data_files:
            data['categories'] = pd.read_sql_query("SELECT * FROM business_categories", conns['business'])
        if "review" in data_files:
            data['review'] = pd.read_sql_query("SELECT * FROM review_data", conns['review'])
    except Exception as e:
        print("Error loading data from database: ", e)
    finally:
        # Close all database connections
        for key, value in conns.items():
            value.close()
    return data


def get_user_business(df_business, df_review, test_size=0.2):
    df_concat = df_business.merge(df_review, on='business_id', how='outer', suffixes=('_business', '_review'))

    user_business = df_concat[["user_id", "business_id", "stars_review"]]

    user_mapping = {user: idx for idx, user in enumerate(user_business['user_id'].unique())}
    business_mapping = {biz: idx for idx, biz in enumerate(user_business['business_id'].unique())}


