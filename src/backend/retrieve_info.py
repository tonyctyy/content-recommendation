import sqlite3

yelp_data_path = '../../data/processed_data/yelp_data/'
db_path_business = yelp_data_path + 'yelp_business_data.db'
db_path_review = yelp_data_path + 'yelp_review_data.db'
db_path_user = yelp_data_path + 'yelp_user_data.db'
db_path_tip = yelp_data_path + 'yelp_tip_data.db'

def retrieve_business_info(business_ids, db_path_business=db_path_business, db_path_review=db_path_review, db_path_user=db_path_user, db_path_tip=db_path_tip):
    # Connect to databases
    conn_business = sqlite3.connect(db_path_business)
    conn_review = sqlite3.connect(db_path_review)
    conn_user = sqlite3.connect(db_path_user)
    conn_tip = sqlite3.connect(db_path_tip)

    business_info = {}

    try:
        # Fetch business details including the new fields: categories, attributes, hours
        business_details_query = f"""
        SELECT b.business_id, b.name, b.address, b.city, b.state, b.postal_code, b.latitude, b.longitude, 
               b.stars, b.review_count, b.is_open, b.attributes, b.hours
        FROM business_details b
        WHERE b.business_id IN ({','.join(['?' for _ in business_ids])})
        """
        cursor = conn_business.execute(business_details_query, business_ids)
        business_details = cursor.fetchall()

        # Add business details to result, including attributes and hours
        for business in business_details:
            business_id = business[0]
            business_info[business_id] = {
                "business_id": business_id,
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
                "attributes": business[11],
                "hours": business[12],
                "categories": [],  # Placeholder for categories
                "reviews": [],
                "tips": [],
                "checkins": []
            }

        # Fetch categories for each business
        category_query = f"""
        SELECT business_id, category
        FROM business_categories
        WHERE business_id IN ({','.join(['?' for _ in business_ids])})
        """
        cursor = conn_business.execute(category_query, business_ids)
        categories = cursor.fetchall()

        # Add categories to corresponding businesses
        for category in categories:
            business_id = category[0]
            if business_id in business_info:
                business_info[business_id]['categories'].append(category[1])

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

        # Fetch check-ins
        checkin_query = f"SELECT * FROM checkin_data WHERE business_id IN ({','.join(['?' for _ in business_ids])})"
        cursor = conn_business.execute(checkin_query, business_ids)
        checkins = cursor.fetchall()

        # Add check-in data to corresponding businesses
        for checkin in checkins:
            business_id = checkin[0]
            checkin_data = {
                "checkin_date": checkin[1]
            }
            if business_id in business_info:
                business_info[business_id]['checkins'].append(checkin_data)

    except Exception as e:
        print(f"Error retrieving business info: {str(e)}")

    finally:
        # Close database connections
        conn_business.close()
        conn_review.close()
        conn_user.close()
        conn_tip.close()

    return business_info


def retrieve_user_info(user_ids, db_path_user=db_path_user):
    # Connect to the database
    conn_user = sqlite3.connect(db_path_user)
    user_info = {}

    # Convert user_ids to a list if it's a single string
    if type(user_ids) == str:
        user_ids = [user_ids]

    try:
        # Fetch user details including the new fields
        user_details_query = f"""
        SELECT user_id, name, review_count, yelping_since, useful, funny, cool, fans,
               average_stars, friends, elite, compliment_hot, compliment_more,
               compliment_profile, compliment_cute, compliment_list, compliment_note,
               compliment_plain, compliment_cool, compliment_funny,
               compliment_writer, compliment_photos, categories
        FROM user_data
        WHERE user_id IN ({','.join(['?' for _ in user_ids])})
        """
        cursor = conn_user.execute(user_details_query, user_ids)
        user_details = cursor.fetchall()

        # Add user details to result
        for user in user_details:
            user_id = user[0]
            user_info[user_id] = {
                "user_id": user_id,
                "name": user[1],
                "review_count": user[2],
                "yelping_since": user[3],
                "useful": user[4],
                "funny": user[5],
                "cool": user[6],
                "fans": user[7],
                "average_stars": user[8],
                "friends": [],
                "elite": [],
                "compliments": {
                    "hot": user[11],
                    "more": user[12],
                    "profile": user[13],
                    "cute": user[14],
                    "list": user[15],
                    "note": user[16],
                    "plain": user[17],
                    "cool": user[18],
                    "funny": user[19],
                    "writer": user[20],
                    "photos": user[21],
                }
            }
            if user[9]:
                user_info[user_id]["friends"] = user[9].split(',')
            if user[10]:
                user_info[user_id]["elite"] = user[10].split(',')
            if user[22]:
                categories_lst = user[22].replace("[", "").replace("]", "").replace("\"", "").split(",")
                user_info[user_id]["categories"] = [category.strip() for category in categories_lst]
    except Exception as e:
        print(f"Error retrieving user info: {str(e)}")

    finally:
        # Close database connection
        conn_user.close()

    return user_info