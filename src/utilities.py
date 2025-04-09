# This file contains utility functions especially for collaborative filtering model

import sqlite3
import pickle
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.metrics import confusion_matrix

def check_py_version():
    print("this utilities.py updated on 3.30.22:43")

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


def get_user_business(df_business, df_review):
    df_concat = df_business.merge(df_review, on='business_id', how='outer', suffixes=('_business', '_review'))
    user_business = df_concat[["user_id", "business_id", "stars_review"]]

    user_mapping = {user: idx for idx, user in enumerate(user_business['user_id'].unique())}
    business_mapping = {biz: idx for idx, biz in enumerate(user_business['business_id'].unique())}    
    return user_mapping, business_mapping, user_business


def balance_test_data(test_data, pos=4):
    # get the number of positive and negative reviews in the test data
    positive_reviews = test_data[test_data['stars_review'] >= pos]
    negative_reviews = test_data[test_data['stars_review'] < pos]

    print(f"Number of positive reviews: {len(positive_reviews)}")
    print(f"Number of negative reviews: {len(negative_reviews)}")
    print(f"Total number of reviews: {len(test_data)}")
    print(f"Ratio of positive to negative reviews: {len(positive_reviews) / len(negative_reviews):.2f}")

    # down-sample the positive reviews to balance the dataset
    positive_reviews_downsampled = positive_reviews.sample(n=len(negative_reviews), random_state=42)

    # combine the down-sampled positive reviews with the negative reviews
    balanced_test_data = pd.concat([positive_reviews_downsampled, negative_reviews], ignore_index=True)

    # shuffle the balanced test data
    balanced_test_data = balanced_test_data.sample(frac=1, random_state=42).reset_index(drop=True)

    # new statistics for the balanced test data
    positive_reviews = balanced_test_data[balanced_test_data['stars_review'] >= pos]
    negative_reviews = balanced_test_data[balanced_test_data['stars_review'] < pos]

    print(f"Number of positive reviews: {len(positive_reviews)}")
    print(f"Number of negative reviews: {len(negative_reviews)}")
    print(f"Total number of reviews: {len(balanced_test_data)}")
    print(f"Ratio of positive to negative reviews: {len(positive_reviews) / len(negative_reviews):.2f}")
    return balanced_test_data


# Function to get businesses a user interacted with
def get_user_businesses(user_id, conn):
    cursor = conn.cursor()
    cursor.execute('''SELECT business_id, stars_review FROM user_item_index WHERE user_id = ?''', (user_id,))
    return cursor.fetchall()


# Function to get top-k similar businesses for a given business
def get_top_k_similar_businesses(business_id, business_mapping, conn, k=100):
    cursor = conn.cursor()
    cursor.execute('''SELECT similarity_vector FROM item_item_similarity WHERE item_id = ?''', (business_id,))
    result = cursor.fetchone()

    if result is None:
        return []

    similarity_vector = pickle.loads(result[0])
    indices, data = similarity_vector

    # Get top-k similar businesses
    top_k = sorted(zip(indices, data), key=lambda x: -x[1])[:k]

    # Map indices to business ids
    similar_businesses = [(list(business_mapping.keys())[idx], score) for idx, score in top_k]

    return similar_businesses


# Function to predict user interests based on similar businesses
def predict_user_interests(user_id, business_mapping, conn, k=100):       # k is the number of recommendations to make
    user_businesses = get_user_businesses(user_id, conn)

    recommended_businesses = {}
    for business_id, _ in user_businesses:
        similar_businesses = get_top_k_similar_businesses(business_id, business_mapping, conn, k)

        for similar_business_id, score in similar_businesses:
            if similar_business_id in recommended_businesses:
                recommended_businesses[similar_business_id] += score
            else:
                recommended_businesses[similar_business_id] = score

    # Sort recommendations by score
    recommended_businesses = sorted(recommended_businesses.items(), key=lambda x: -x[1])

    return recommended_businesses[:k]





# Function to predict user interest in a specific business
def get_business_interest(user_id, business_id, business_mapping, conn, k=100):
    user_businesses = get_user_businesses(user_id, conn)

    if not user_businesses:
        return 0  # User has no previous interactions

    # Convert user_businesses to a dictionary for fast lookup
    user_ratings_dict = {biz_id: rating for biz_id, rating in user_businesses}

    # Compute the user's average rating
    user_avg_rating = np.mean(list(user_ratings_dict.values()))

    # Get top-K similar businesses
    similar_businesses = get_top_k_similar_businesses(business_id, business_mapping, conn, k)

    weighted_sum = 0
    similarity_sum = 0

    for similar_biz, similarity in similar_businesses:
        if similar_biz in user_ratings_dict:
            rating = user_ratings_dict[similar_biz]
            weighted_sum += similarity * (rating - user_avg_rating)
            similarity_sum += similarity

    # Return user_avg_rating if no similar business has been rated
    if similarity_sum == 0:
        # return user_avg_rating
        return -1
    return user_avg_rating + (weighted_sum / similarity_sum)



def simulate_recommendations(test_data_grouped, user_mapping, business_mapping, conn, k=300, num_users=10):
    # get the recommendations for each user in the test data
    recommendations = {}

    i = 0
    for user_id in test_data_grouped['user_id']:
        recommendation = predict_user_interests(user_id,business_mapping, conn, k)
        business_ids, scores = [], []
        for business_id, score in recommendation:
            business_ids.append(business_id)
            scores.append(score)
        recommendations[user_id] = (business_ids, scores) 
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
        user_id = row['user_id']
        business_ids = row['business_id']
        rank = 0
        if user_id in recommendations:
            recommended_businesses = recommendations[user_id][0]
            for business_id in business_ids:
                star_rating = test_data[(test_data['user_id'] == user_id) & (test_data['business_id'] == business_id)]['stars_review'].values[0]
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


def predict_recommendations(test_data, test_data_grouped,business_mapping, conn, pos=4):
    # optimized code (run time: 4m)
    # Initialize lists to store predictions and actual values
    predicted_labels = []
    actual_labels = []
    unrated_count = 0  # Count how many times -1 is returned
    positive_count = 0
    negative_count = 0
    null_count = 0
    k = min(1000, len(test_data_grouped))  # Ensure k does not exceed available data

    # Convert test_data into a dictionary for fast lookups
    test_data_dict = {
        (row['user_id'], row['business_id']): row['stars_review']
        for _, row in test_data.iterrows()
    }

    # Iterate over user-business pairs
    for i in range(k):
        user_id = test_data_grouped['user_id'].iloc[i]
        business_ids = test_data_grouped['business_id'].iloc[i]

        for business_id in business_ids:
            predicted_rating = get_business_interest(user_id, business_id, business_mapping, conn, k=100)
            
            # Lookup actual rating using dictionary for O(1) access
            actual_rating = test_data_dict.get((user_id, business_id), None)
            
            if actual_rating is None:
                null_count += 1
            else:
                if actual_rating >= pos:
                    positive_count += 1
                else:
                    negative_count += 1
            
            if actual_rating is None or predicted_rating == -1:
                unrated_count += 1
                continue  # Skip evaluation for unrated items

            # Convert ratings to binary labels (positive: 1, negative: 0)
            predicted_labels.append(predicted_rating >= pos)
            actual_labels.append(actual_rating >= pos)

    # Convert to NumPy arrays for potential vectorized operations later
    predicted_labels = np.array(predicted_labels, dtype=np.int8)
    actual_labels = np.array(actual_labels, dtype=np.int8)
    return predicted_labels, actual_labels, positive_count, negative_count, null_count, unrated_count



def compute_prediction_evaluation(actual_labels, predicted_labels,  prediction_lst=[], beta=2):
    tn, fp, fn, tp = confusion_matrix(actual_labels, predicted_labels).ravel()        
    evaluation_metric, confusion, background_stats = compute_evaluation_metric(tp, tn, fp, fn, len(actual_labels), tp + fn, None)
    if len(prediction_lst) > 0:
        evaluation_metric['Recall'] = evaluation_metric['Recall']*background_stats['Total Positive']/prediction_lst[0] if prediction_lst[0] > 0 else 0
        background_stats['Total Positive'] = prediction_lst[0]
        background_stats['Total Negative'] = prediction_lst[1]
        background_stats['Total'] = prediction_lst[0] + prediction_lst[1]
        background_stats['Ratio'] = prediction_lst[0] / float(prediction_lst[0] + prediction_lst[1]) if prediction_lst[0] + prediction_lst[1] > 0 else 0
        
        # add unrated count percentage to evaluation metric 
        evaluation_metric['Unrated Count'] = prediction_lst[2] / background_stats['Total']
        evaluation_metric['F1 Score'] = 2 * (evaluation_metric['Precision'] * evaluation_metric['Recall']) / (evaluation_metric['Precision'] + evaluation_metric['Recall'])
        evaluation_metric['F-beta Score'] = (1 + beta**2) * (evaluation_metric['Precision'] * evaluation_metric['Recall']) / (beta**2 * evaluation_metric['Precision'] + evaluation_metric['Recall']) 
    return evaluation_metric, confusion, background_stats