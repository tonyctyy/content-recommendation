import sqlite3

def retrieve_business_info(business_ids):
    # Paths to database files
    db_path_business = '../../data/processed_data/yelp_data/yelp_business_data.db'
    db_path_review = '../../data/processed_data/yelp_data/yelp_review_data.db'
    db_path_user = '../../data/processed_data/yelp_data/yelp_user_data.db'
    db_path_tip = '../../data/processed_data/yelp_data/yelp_tip_data.db'

    # Connect to databases
    conn_business = sqlite3.connect(db_path_business)
    conn_review = sqlite3.connect(db_path_review)
    conn_user = sqlite3.connect(db_path_user)
    conn_tip = sqlite3.connect(db_path_tip)

    business_info = {}

    try:
        # Fetch business details
        business_details_query = f"SELECT * FROM business_details WHERE business_id IN ({','.join(['?' for _ in business_ids])})"
        cursor = conn_business.execute(business_details_query, business_ids)
        business_details = cursor.fetchall()

        # Add business details to result
        for business in business_details:
            business_info[business[0]] = {
                "business_id": business[0],
                "name": business[1],
                "address": business[2],
                "city": business[3],
                "state": business[4],
                "postal_code": business[5],
                "latitude": business[6],
                "longitude": business[7],
                "stars": business[8],
                "review_count": business[9],
                "is_open": business[10],
                "reviews": [],
                "tips": []
            }

        # Fetch reviews
        review_query = f"SELECT * FROM review_data WHERE business_id IN ({','.join(['?' for _ in business_ids])})"
        cursor = conn_review.execute(review_query, business_ids)
        reviews = cursor.fetchall()

        # Add reviews to corresponding businesses
        for review in reviews:
            business_id = review[2]
            review_data = {
                "review_id": review[0],
                "user_id": review[1],
                "stars": review[3],
                "date": review[4],
                "text": review[5],
                "useful": review[6],
                "funny": review[7],
                "cool": review[8]
            }
            if business_id in business_info:
                business_info[business_id]['reviews'].append(review_data)

        # Fetch tips
        tip_query = f"SELECT * FROM tip_data WHERE business_id IN ({','.join(['?' for _ in business_ids])})"
        cursor = conn_tip.execute(tip_query, business_ids)
        tips = cursor.fetchall()

        # Add tips to corresponding businesses
        for tip in tips:
            business_id = tip[1]
            tip_data = {
                "user_id": tip[0],
                "text": tip[2],
                "date": tip[3],
                "compliment_count": tip[4]
            }
            if business_id in business_info:
                business_info[business_id]['tips'].append(tip_data)

    except Exception as e:
        print(f"Error retrieving business info: {str(e)}")

    finally:
        # Close database connections
        conn_business.close()
        conn_review.close()
        conn_user.close()
        conn_tip.close()

    return business_info
