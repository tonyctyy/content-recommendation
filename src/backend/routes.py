from flask import render_template
from api import get_ItemCF_recommendations, get_DSSM_recommendations, get_business_info

def create_routes(app):
    """
    Web routes
    ----------------
    """
    @app.route('/')
    def index():
        return render_template('index.html')
    
    @app.route('/retrieval_models')
    def retrieval_models():
        return render_template('retrieval_models.html')

    """
    API routes
    ----------------
    """
    @app.route('/ItemCF_recommendations', methods=['GET'])
    def ItemCF_recommendations():
        return get_ItemCF_recommendations()
    
    @app.route('/DSSM_recommendations', methods=['GET'])
    def DSSM_recommendations():
        return get_DSSM_recommendations()

    @app.route('/business_info', methods=['GET'])
    def business_info():
        return get_business_info()
