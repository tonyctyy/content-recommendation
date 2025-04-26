from flask import request, jsonify
from models.ItemCF import ItemCF_predict_user_interests, ItemCF_predict_cluster_interests
from models.UserCF import UserCF_predict_user_interests, UserCF_predict_cluster_interests
from models.DSSM import *
from models.DeepFM import *
from cluster import *
from retrieve_info import retrieve_business_info, retrieve_user_info

def get_ItemCF_recommendations():
    data = request.get_json()
    user_id = data.get('user_id')
    k = data.get('k', 10)

    if not user_id:
        return jsonify({"error": "user_id is required"}), 400

    try:
        users = retrieve_user_info(user_id)
        recommendations = ItemCF_predict_user_interests(user_id, int(k))
        return jsonify({"user_id": user_id, "recommendations": recommendations, "users": users}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def get_UserCF_recommendations():
    data = request.get_json() 
    user_id = data.get('user_id')
    k = data.get('k', 10)

    if not user_id:
        return jsonify({"error": "user_id is required"}), 400

    try:
        users = retrieve_user_info(user_id)
        recommendations = UserCF_predict_user_interests(user_id, int(k))
        return jsonify({"user_id": user_id, "recommendations": recommendations, "users": users}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def get_DSSM_recommendations():
    data = request.get_json()
    user_id = data.get('user_id')
    k = data.get('k', 10)
    
    if not user_id:
        return jsonify({"error": "user_id is required"}), 400
    
    try:
        users = retrieve_user_info(user_id)
        recommendations = DSSM_query_top_k(user_id, DSSM_user_model, DSSM_faiss_index, DSSM_business_ids, DSSM_user_id_encoder, DSSM_business_id_encoder, DSSM_user_scaler, DSSM_user_continuous_features_scaled, k=int(k))
        return jsonify({"user_id": user_id, "recommendations": recommendations, "users": users}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def get_DeepFM_recommendations():
    data = request.get_json()
    user_id = data.get('user_id')
    
    # get results from ItemCF
    ItemCF_k = 300
    ItemCF_recommendations = ItemCF_predict_user_interests(user_id, ItemCF_k)

    UserCF_k = 500
    UserCF_recommendations = UserCF_predict_user_interests(user_id, UserCF_k)

    # get results from DSSM
    DSSM_k = 5000
    DSSM_recommendations = DSSM_query_top_k(user_id, DSSM_user_model, DSSM_faiss_index, DSSM_business_ids, DSSM_user_id_encoder, DSSM_business_id_encoder, DSSM_user_scaler, DSSM_user_continuous_features_scaled, k=DSSM_k)

    # combine the results into unique business ids
    business_ids = [business_id for business_id, _ in ItemCF_recommendations + DSSM_recommendations + UserCF_recommendations]
    
    business_ids = list(set(business_ids))
    try:
        user_info = retrieve_user_info(user_id)
        business_info = retrieve_business_info(business_ids)

        # use DeepFM to rank the businesses
        recommended_businesses = DeepFM_rank_top_k(DeepFM_model, user_id, business_ids, user_info, business_info, DeepFM_user_id_encoder, DeepFM_business_id_encoder, DeepFM_user_scaler, DeepFM_business_scaler, k=100)

        recommended_business_ids = [business_id for business_id, _ in recommended_businesses]
        business_infos = {business_id: business_info[business_id] for business_id in recommended_business_ids if business_id in business_info}

        return jsonify({"user_id": user_id, "recommendations": recommended_businesses, "users": user_info, "businesses":business_infos}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
def get_Cluster_recommendations():
    data = request.get_json()
    categories = data.get('categories')
    k = data.get('k', 10)
    ItemCF_recommendations = ItemCF_predict_cluster_interests(categories, k)
    UserCF_recommendations = UserCF_predict_cluster_interests(categories)

    ItemCF_business_ids = set([business_id for business_id, _ in ItemCF_recommendations])
    UserCF_business_ids = set([business_id for business_id, _ in UserCF_recommendations])
    UserCF_business_ids = UserCF_business_ids - ItemCF_business_ids
    UserCF_recommendations = [(business_id, score) for business_id, score in UserCF_recommendations if business_id in UserCF_business_ids]
    # combine the two recommendations
    recommendations = ItemCF_recommendations + UserCF_recommendations
    return jsonify({'recommendations': recommendations}), 200 

def get_business_info():
    data = request.get_json()
    business_ids = data.get('business_ids')

    if not business_ids:
        return jsonify({"error": "No business IDs provided"}), 400
    
    business_ids_list = business_ids.split(',')  # Split comma-separated business IDs
    
    try:
        business_info_dict = retrieve_business_info(business_ids_list)
        return jsonify(business_info_dict), 200 
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
def get_user_info():
    data = request.get_json()
    user_id = data.get('user_id')

    if not user_id:
        return jsonify({"error": "user_id is required"}), 400

    try:
        user_info = retrieve_user_info(user_id)
        return jsonify(user_info), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500