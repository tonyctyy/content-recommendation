from flask import request, jsonify
from models.ItemCF import ItemCF_predict_user_interests
from models.DSSM import *
from models.DeepFM import *
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

    # get results from DSSM
    DSSM_k = 1000
    DSSM_recommendations = DSSM_query_top_k(user_id, DSSM_user_model, DSSM_faiss_index, DSSM_business_ids, DSSM_user_id_encoder, DSSM_business_id_encoder, DSSM_user_scaler, DSSM_user_continuous_features_scaled, k=DSSM_k)

    # combine the results
    business_ids = [business_id for business_id, _ in ItemCF_recommendations + DSSM_recommendations]
    business_ids = list(set(business_ids))
    try:
        user_info = retrieve_user_info(user_id)
        business_info = retrieve_business_info(business_ids)

        # use DeepFM to rank the businesses
        recommended_businesses = DeepFM_rank_top_k(DeepFM_model, user_id, business_ids, user_info, business_info, DeepFM_user_id_encoder, DeepFM_business_id_encoder, DeepFM_user_scaler, DeepFM_business_scaler, k=100)

        return jsonify({"user_id": user_id, "recommendations": recommended_businesses, "users": user_info}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

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