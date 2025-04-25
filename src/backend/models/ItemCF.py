import pickle
from .utils import get_db_connection, get_user_businesses, get_cluster_businesses, find_cluster_id

# Retrieve user-business mappings
def retrieve_business_mapping(conn):
    cursor = conn.cursor()
    cursor.execute('''SELECT business_id, business_idx FROM business_mapping''')
    business_mapping = {row[0]: row[1] for row in cursor.fetchall()}
    return business_mapping

# Get top-k similar businesses
def get_top_k_similar_businesses(business_id, k, conn, business_mapping):
    cursor = conn.cursor()
    cursor.execute('''SELECT similarity_vector FROM item_item_similarity WHERE item_id = ?''', (business_id,))
    result = cursor.fetchone()

    if result is None:
        return []
    similarity_vector = pickle.loads(result[0])
    indices, data = similarity_vector

    top_k = sorted(zip(indices, data), key=lambda x: -x[1])[:k]
    similar_businesses = [(list(business_mapping.keys())[idx], score) for idx, score in top_k]
    return similar_businesses

# Predict user interests
def ItemCF_predict_user_interests(user_id, k):
    db_path = '../../data/processed_data/yelp_ItemCF.db'
    conn = get_db_connection(db_path)
    business_mapping = retrieve_business_mapping(conn)
    user_businesses = get_user_businesses(user_id, conn)

    recommended_businesses = {}
    for business_id, _ in user_businesses:
        similar_businesses = get_top_k_similar_businesses(business_id, k, conn, business_mapping)

        for similar_business_id, score in similar_businesses:
            if similar_business_id in recommended_businesses:
                recommended_businesses[similar_business_id] += score
            else:
                recommended_businesses[similar_business_id] = score

    recommended_businesses = sorted(recommended_businesses.items(), key=lambda x: -x[1])
    conn.close()
    return recommended_businesses[:k]

def ItemCF_predict_cluster_interests(categories, k=100):
    cluster = find_cluster_id(categories)
    db_path = '../../data/processed_data/yelp_ClusterItemCF.db'
    conn = get_db_connection(db_path)
    business_mapping = retrieve_business_mapping(conn)
    cluster_businesses = get_cluster_businesses(cluster, conn)
    recommended_businesses = {}
    for business_id, _ in cluster_businesses:
        similar_businesses = get_top_k_similar_businesses(business_id, k, conn, business_mapping)

        for similar_business_id, score in similar_businesses:
            if similar_business_id in recommended_businesses:
                recommended_businesses[similar_business_id] += score
            else:
                recommended_businesses[similar_business_id] = score
    # Sort recommendations by score
    recommended_businesses = sorted(recommended_businesses.items(), key=lambda x: -x[1])

    return recommended_businesses[:k]
