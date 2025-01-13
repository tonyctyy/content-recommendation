from flask import request, jsonify
from models.ItemCF import ItemCF_predict_user_interests
from models.DSSM import *
from retrieve_info import retrieve_business_info, retrieve_user_info

def get_ItemCF_recommendations():
    user_id = request.args.get('user_id')

    k = request.args.get('k', 10)

    if not user_id:
        return jsonify({"error": "user_id is required"}), 400

    try:
        users = retrieve_user_info(user_id)
        recommendations = ItemCF_predict_user_interests(user_id, int(k))
        return jsonify({"user_id": user_id, "recommendations": recommendations, "users": users}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def get_DSSM_recommendations():
    user_id = request.args.get('user_id')
    k = request.args.get('k', 100)

    if not user_id:
        return jsonify({"error": "user_id is required"}), 400
    
    try:
        users = retrieve_user_info(user_id)
        recommendations = DSSM_query_top_k(user_id, DSSM_user_model, DSSM_faiss_index, DSSM_business_ids, DSSM_user_id_encoder, DSSM_business_id_encoder, DSSM_user_scaler, DSSM_user_continuous_features_scaled, k=int(k))
        return jsonify({"user_id": user_id, "recommendations": recommendations, "users": users}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


def get_business_info():
    business_ids = request.args.get('business_ids')

    if not business_ids:
        return jsonify({"error": "No business IDs provided"}), 400
    
    business_ids_list = business_ids.split(',')  # Split comma-separated business IDs
    
    try:
        business_info_dict = retrieve_business_info(business_ids_list)
        return jsonify(business_info_dict), 200 
    except Exception as e:
        return jsonify({"error": str(e)}), 500