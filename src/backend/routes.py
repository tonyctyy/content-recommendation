from flask import render_template, request
from api import get_ItemCF_recommendations, get_UserCF_recommendations, get_DSSM_recommendations, get_DeepFM_recommendations, get_Cluster_recommendations, get_business_info, get_user_info

def create_routes(app):
    """
    Web routes
    ----------------
    """
    @app.route('/')
    def index():
        return render_template('index.html')
    
    @app.route('/models_testing')
    def models_testing():
        return render_template('models_testing.html')

    """
    API routes
    ----------------
    """
    @app.route('/ItemCF_recommendations', methods=['POST'])
    def ItemCF_recommendations():
        if request.method == 'OPTIONS':
            return '', 200
        return get_ItemCF_recommendations()
    
    @app.route('/UserCF_recommendations', methods=['POST'])
    def UserCF_recommendations():
        if request.method == 'OPTIONS':
            return '', 200
        return get_UserCF_recommendations()
    
    @app.route('/DSSM_recommendations', methods=['POST'])
    def DSSM_recommendations():
        if request.method == 'OPTIONS':
            return '', 200
        return get_DSSM_recommendations()
    
    @app.route('/DeepFM_recommendations', methods=['POST'])
    def DeepFM_recommendations():
        if request.method == 'OPTIONS':
            return '', 200
        return get_DeepFM_recommendations()
    
    @app.route('/Cluster_recommendations', methods=['POST'])
    def Cluster_recommendations():
        if request.method == 'OPTIONS':
            return '', 200
        return get_Cluster_recommendations()

    @app.route('/business_info', methods=['POST'])
    def business_info():
        if request.method == 'OPTIONS':
            return '', 200
        return get_business_info()
    
    @app.route('/user_info', methods=['POST'])
    def user_info():
        if request.method == 'OPTIONS':
            return '', 200
        return get_user_info()
