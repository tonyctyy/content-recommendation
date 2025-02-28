import numpy as np
import pickle
import faiss
from tensorflow.keras.models import load_model
from sklearn.preprocessing import normalize

save_folder_path = "../../data/processed_data/DSSM/"

# Load business IDs
DSSM_business_ids = np.load(save_folder_path + "business_ids.npy")

# Load the Faiss index from the file
DSSM_faiss_index = faiss.read_index(save_folder_path + "faiss_index.bin")

# Load the user model
DSSM_user_model = load_model(save_folder_path + 'user_model.keras')

# Load the saved label encoders
with open(save_folder_path + 'user_id_encoder.pkl', 'rb') as f:
    DSSM_user_id_encoder = pickle.load(f)

with open(save_folder_path + 'business_id_encoder.pkl', 'rb') as f:
    DSSM_business_id_encoder = pickle.load(f)

# Load the saved scalers
with open(save_folder_path + 'user_scaler.pkl', 'rb') as f:
    DSSM_user_scaler = pickle.load(f)

# Load the saved user continuous features (temporal solution)
with open(save_folder_path + 'user_continuous_features_scaled.pkl', 'rb') as f:
    DSSM_user_continuous_features_scaled = pickle.load(f)

def DSSM_query_top_k(user_id, user_model, faiss_index, business_ids, user_id_encoder, business_id_encoder, user_scaler, user_continuous_features_scaled, k=100):
    # Check if the user_id is in the user_id_encoder
    if user_id not in user_id_encoder.classes_:
        raise ValueError("User ID is not in the encoder")

    # Encode user_id and get continuous features
    user_id_encoded = user_id_encoder.transform([user_id])[0]
    user_cont_features = user_scaler.transform(
        user_continuous_features_scaled.loc[[user_id_encoded]].values
    )
    # Predict the user's embedding
    user_embedding = user_model.predict([np.array([user_id_encoded]), user_cont_features])
    user_embedding_normalized = normalize(user_embedding, axis=1)

    # Perform ANN search using Faiss
    similarity, indices = faiss_index.search(user_embedding_normalized, k)

    # Return top-k businesses and distances
    top_k_business_ids = business_ids[indices.flatten()]

    # Decode business IDs back to their original format
    decoded_business_ids = business_id_encoder.inverse_transform(top_k_business_ids)

    # Convert them into a list of tuples for JSON serialization
    recommended_businesses = list(zip(decoded_business_ids.tolist(), similarity.flatten().tolist()))
    return recommended_businesses
