from flask import render_template
from api import get_ItemCF_recommendations, get_business_info

def create_routes(app):
    """
    Web routes
    ----------------
    """
    @app.route('/')
    def index():
        return render_template('index.html')

    @app.route('/item_cf')
    def item_cf():
        return render_template('item_cf.html')

    """
    API routes
    ----------------
    """
    @app.route('/ItemCF_recommendations', methods=['GET'])
    def ItemCF_recommendations():
        return get_ItemCF_recommendations()

    @app.route('/business_info', methods=['GET'])
    def business_info():
        return get_business_info()
