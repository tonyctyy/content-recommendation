import numpy as np
import pandas as pd
import pickle
from sklearn.neighbors import NearestNeighbors

cluster_folder_path = "../../data/processed_data/cluster_data/"

with open(cluster_folder_path + 'users_categories_encoder.pkl', 'rb') as f:
    user_category_encoder = pickle.load(f)

clustered_user_df = pd.read_pickle(cluster_folder_path + 'clustered_user_df.pkl')

def find_nearest_neighbor(categories, clustered_user_df=clustered_user_df, user_category_encoder=user_category_encoder):
    # check if categories is a list of lists, if not, convert it to a list of lists
    if not isinstance(categories[0], list):
        categories = [categories]

    # Encode the categories using the user_category_encoder
    encoded_categories = user_category_encoder.transform(categories)

    # Select the encoded features from clustered_user_df; assume all columns except 'user_id'
    features = clustered_user_df.drop(columns=['user_id', 'cluster']).values

    # Create the NearestNeighbors model using Jaccard metric
    nn_model = NearestNeighbors(n_neighbors=1, metric='jaccard')
    nn_model.fit(features)

    # Query the model to get nearest neighbor index and distance
    distances, indices = nn_model.kneighbors(encoded_categories)

    # Create a list to hold results
    results = []
    for idx, (dist, ind) in enumerate(zip(distances, indices)):
        # Get the corresponding user_id from clustered_user_df using the index
        nearest_cluster_id = clustered_user_df.iloc[ind[0]]['cluster']
        results.append(nearest_cluster_id)
    return results


def get_user_cluster(user_ids, clustered_user_df=clustered_user_df):
    # check if user_ids exists in clustered_user_df, get the "clusters" column for existing user_ids, return the user_ids that are not in clustered_user_df
    clusters = clustered_user_df[clustered_user_df['user_id'].isin(user_ids)]['cluster'].tolist()

    # get the user_ids that are not in clustered_user_df
    missing_user_ids = list(set(user_ids) - set(clustered_user_df['user_id'].tolist()))
    return clusters, missing_user_ids