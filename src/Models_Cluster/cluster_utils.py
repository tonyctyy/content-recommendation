import pickle
import sqlite3
import pandas as pd
import numpy as np

# Connect to the databases and load data
def load_data_from_db(db_folder, data_files):
    db_files = {}
    if "business" or "categories" in data_files:
        db_files['business'] = 'yelp_business_data.db'
    if "review" in data_files:
        db_files['review'] = 'yelp_review_data.db'
    if "user" in data_files:
        db_files['user'] = 'yelp_user_data.db'

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
        if "user" in data_files:
            data['user'] = pd.read_sql_query("SELECT * FROM user_data", conns['user'])
    except Exception as e:
        print("Error loading data from database: ", e)
    finally:
        # Close all database connections
        for key, value in conns.items():
            value.close()
    return data


def get_cluster_businesses(cluster, conn):
    cursor = conn.cursor()
    cursor.execute('''SELECT business_id, score FROM cluster_item_index WHERE cluster = ?''', (cluster,))
    return cursor.fetchall()

def get_top_k_similar_businesses(business_id, business_mapping, conn, k=100):
    cursor = conn.cursor()
    cursor.execute('''SELECT similarity_vector FROM item_item_similarity WHERE item_id = ?''', (business_id,))
    result = cursor.fetchone()

    if result is None:
        return []

    similarity_vector = pickle.loads(result[0])
    indices, data = similarity_vector
    print(indices)
    # Get top-k similar businesses
    top_k = sorted(zip(indices, data), key=lambda x: -x[1])[:k]

    # Map indices to business ids
    similar_businesses = [(list(business_mapping.keys())[idx], score) for idx, score in top_k]

    return similar_businesses

def predict_cluster_interests(cluster, business_mapping, conn, k=100):
    cluster_businesses = get_cluster_businesses(cluster, conn)

    recommended_businesses = {}
    for business_id, _ in cluster_businesses:
        similar_businesses = get_top_k_similar_businesses(business_id, business_mapping, conn, k)

        for similar_business_id, score in similar_businesses:
            if similar_business_id in recommended_businesses:
                recommended_businesses[similar_business_id] += score
            else:
                recommended_businesses[similar_business_id] = score
    # Sort recommendations by score
    recommended_businesses = sorted(recommended_businesses.items(), key=lambda x: -x[1])

    return recommended_businesses[:k]

def simulate_recommendations(test_data_grouped, business_mapping, conn, k=300, num_users=10):
    recommendations = {}
    i = 0
    for cluster_id in test_data_grouped['cluster']:
        recommendation = predict_cluster_interests(cluster_id,business_mapping, conn, k)
        business_ids, scores = [], []
        for business_id, score in recommendation:
            business_ids.append(business_id)
            scores.append(score)
        recommendations[cluster_id] = (business_ids, scores) 
        i += 1
        # i is used to limit the number of recommendations to display
        if i == num_users:
            break
    return recommendations

def check_retrieval_recommendations(recommendations, test_data, test_data_grouped, pos=4):
    total = 0
    total_positive = 0
    true_positive = 0
    true_negative = 0
    false_positive = 0
    false_negative = 0
    ranks = []
    for i, row in test_data_grouped.iterrows():
        cluster_id = row['cluster']
        business_ids = row['business_id']
        rank = 0
        if cluster_id in recommendations:
            recommended_businesses = recommendations[cluster_id][0]
            for business_id in business_ids:
                star_rating = test_data[(test_data['cluster'] == cluster_id) & (test_data['business_id'] == business_id)]['score'].values[0]
                if star_rating >= pos:
                    total_positive += 1
                if business_id in recommended_businesses:
                    if star_rating >= pos:
                        true_positive += 1
                    else:
                        false_positive += 1
                    # get the rank of the business_id in the recommendations
                    rank = recommended_businesses.index(business_id) + 1
                else:
                    if star_rating < pos:
                        true_negative += 1
                    else:
                        false_negative += 1
            total += len(business_ids)
        ranks.append(rank)
    return true_positive, true_negative, false_positive, false_negative, total, total_positive, ranks

def compute_evaluation_metric(true_positive, true_negative, false_positive, false_negative, total, total_positive, ranks):
# Calculate evaluation metrics
    accuracy = (true_positive + true_negative) / float(total) if total > 0 else 0
    precision = true_positive / float(true_positive + false_positive) if (true_positive + false_positive) > 0 else 0
    recall = true_positive / float(total_positive) if total_positive > 0 else 0
    f1_score = 2 * precision * recall / (precision + recall) if (precision + recall) > 0 else 0

    # Mean Reciprocal Rank (MRR) - safer handling
    mean_reciprocal_rank = np.mean([1 / rank for rank in ranks if rank is not None and rank > 0]) if ranks else None

    # Weighted Fβ-score
    beta = 2
    f_beta = (1 + beta**2) * precision * recall / (beta**2 * precision + recall) if (beta**2 * precision + recall) > 0 else 0

    # Compute dataset statistics
    total_negative = total - total_positive if total > 0 else 0
    background_stats = pd.DataFrame({
        'Total Positive': [total_positive],
        'Total Negative': [total_negative],
        'Total': [total],
        'Ratio': [total_positive / float(total) if total > 0 else 0],
    })

    # Evaluation Metrics
    evaluation_metric = pd.DataFrame({
        'Accuracy': [accuracy],
        'Precision': [precision],
        'Recall': [recall],
        'F1 Score': [f1_score],
        'F-beta Score': [f_beta],
        'Mean Reciprocal Rank': [mean_reciprocal_rank],
    }).apply(lambda x: round(x, 4))

    # Confusion Matrix
    confusion = pd.DataFrame({
        'True Positive': [true_positive],
        'True Negative': [true_negative],
        'False Positive': [false_positive],
        'False Negative': [false_negative]
    })
    return evaluation_metric, confusion, background_stats