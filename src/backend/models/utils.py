import numpy as np
import pandas as pd
from sklearn.neighbors import NearestNeighbors
import pickle
import sqlite3

# Database connection function
def get_db_connection(db_path):
    conn = sqlite3.connect(db_path)
    return conn

# Get businesses a user interacted with
def get_user_businesses(user_id, conn):
    cursor = conn.cursor()
    cursor.execute('''SELECT business_id, stars_review FROM user_item_index WHERE user_id = ?''', (user_id,))
    return cursor.fetchall()

def get_cluster_businesses(cluster, conn):
    cursor = conn.cursor()
    cursor.execute('''SELECT business_id, score FROM cluster_item_index WHERE cluster = ?''', (cluster,))
    return cursor.fetchall()

def find_nearest_neighbor(encoded_try_list: np.ndarray, clustered_user_df: pd.DataFrame):
    # Ensure the clustered_user_df has a 'user_id' column and encoded category columns.
    if 'user_id' not in clustered_user_df.columns:
        raise ValueError("clustered_user_df must include a 'user_id' column.")

    # Select the encoded features from clustered_user_df; assume all columns except 'user_id'
    features = clustered_user_df.drop(columns=['user_id', 'cluster']).values

    # Create the NearestNeighbors model using Jaccard metric
    nn_model = NearestNeighbors(n_neighbors=1, metric='jaccard')
    nn_model.fit(features)

    # Query the model to get nearest neighbor index and distance
    distances, indices = nn_model.kneighbors(encoded_try_list)

    # Create a list to hold results
    results = []
    for idx, (dist, ind) in enumerate(zip(distances, indices)):
        # Get the corresponding user_id from clustered_user_df using the index
        nearest_cluster_id = clustered_user_df.iloc[ind[0]]['cluster']
        results.append({
            'input_index': int(idx),
            'nearest_cluster_id': int(nearest_cluster_id),
            # 'distance': dist[0]
        })
    return results

def find_cluster_id(categories: list):
    Cluster_folder_path = "../../data/processed_data/cluster_data/"

    clustered_user_df = pd.read_pickle(Cluster_folder_path + 'clustered_user_df.pkl')

    if not isinstance(categories, list) or not all(isinstance(i, list) for i in categories):
        categories = [categories]
    categories = np.array(categories)

    with open(Cluster_folder_path + 'users_categories_encoder.pkl', 'rb') as f:
        user_category_encoder = pickle.load(f)
        f.close()

    encoded_try_list = user_category_encoder.transform(categories)

    results = find_nearest_neighbor(encoded_try_list,clustered_user_df)
    return results[0]['nearest_cluster_id']
