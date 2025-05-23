import pickle
from .utils import get_db_connection, get_user_businesses, find_cluster_id, get_cluster_mapping, get_cluster_businesses

def retrieve_user_user_mapping(conn):
    cursor = conn.cursor()
    # Fetch user mappings
    cursor.execute('''SELECT user_id, user_idx FROM user_mapping''')
    user_mapping = {row[0]: row[1] for row in cursor.fetchall()}
    return user_mapping

def get_top_k_similar_users(user_id, user_mapping, k, conn):
    cursor = conn.cursor()
    cursor.execute('''SELECT similarity_vector FROM user_user_similarity WHERE user_id = ?''', (user_id,))
    result = cursor.fetchone()
    if result is None:
        return []
    similarity_vector = pickle.loads(result[0])
    indices, data = similarity_vector
    # Get top-k similar users
    top_k = sorted(zip(indices, data), key=lambda x: -x[1])[:k]
    # # Map indices to user ids
    idx_to_user = {v: k for k, v in user_mapping.items()}  # Reverse mapping
    similar_users = [(idx_to_user.get(idx, "Unknown"), score) for idx, score in top_k]
    return similar_users

def get_top_k_similar_clusters(cluster_id, cluster_mapping, k, conn):
    if cluster_id is None or cluster_id not in cluster_mapping:
        return []
    cursor = conn.cursor()
    cursor.execute('SELECT similarity_vector FROM cluster_cluster_similarity WHERE cluster_id = ?', (str(cluster_id),))
    result = cursor.fetchone()
    if result is None:
        return []
    similarity_vector = pickle.loads(result[0])
    indices, data = similarity_vector
    top_k = sorted(zip(indices, data), key=lambda x: -x[1])[:k]
    idx_to_cluster = {v: str(k) for k, v in cluster_mapping.items()}  # Ensure cluster_id is string
    similar_clusters = [(idx_to_cluster.get(idx, "Unknown"), score) for idx, score in top_k]
    return similar_clusters

def UserCF_predict_user_interests(user_id, k):
    db_path = '../../data/processed_data/yelp_UserCF.db'
    conn = get_db_connection(db_path)
    user_mapping = retrieve_user_user_mapping(conn)
    # Get top-k similar users
    similar_users = get_top_k_similar_users(user_id, user_mapping, k, conn)  # More similar users

    recommended_businesses = {}
    # For each similar user, get their business interactions
    for similar_user_id, similarity_score in similar_users:
        similar_user_businesses = get_user_businesses(similar_user_id, conn)
        for business_id, score in similar_user_businesses:
            # if test_businesses and business_id not in test_businesses:  # Debug: force overlap
            #     continue
            if business_id in recommended_businesses:
                recommended_businesses[business_id] += score
            else:
                recommended_businesses[business_id] = score
    
    # Sort recommendations by score
    recommended_businesses = sorted(recommended_businesses.items(), key=lambda x: -x[1])   
    conn.close()
    return recommended_businesses[:k]

def UserCF_predict_cluster_interests(categories, k_clusters=10, k_items=500):
    cluster_id = find_cluster_id(categories)
    # convert cluster to string
    cluster_id = str(cluster_id)
    db_path = '../../data/processed_data/yelp_ClusterUserCF.db'
    conn = get_db_connection(db_path)
    cluster_mapping = get_cluster_mapping(conn)
    similar_clusters = get_top_k_similar_clusters(cluster_id, cluster_mapping, k_clusters, conn)

    recommended_businesses = {}
    for similar_cluster_id, similarity_score in similar_clusters:
        similar_cluster_businesses = get_cluster_businesses(conn, '''SELECT business_id, stars_review FROM cluster_item_index WHERE cluster_id = ?''', similar_cluster_id)
        for business_id, score in similar_cluster_businesses:
            if business_id in recommended_businesses:
                recommended_businesses[business_id] += score * similarity_score
            else:
                recommended_businesses[business_id] = score * similarity_score
    recommended_businesses = sorted(recommended_businesses.items(), key=lambda x: -x[1])
    return recommended_businesses[:k_items]