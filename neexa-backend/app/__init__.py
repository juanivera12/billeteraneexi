from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from config.config import config
import os
import logging

# Initialize extensions
db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()

def create_app(config_name=None):
    """Application factory pattern"""
    app = Flask(__name__)
    
    # Load configuration
    config_name = config_name or os.environ.get('FLASK_ENV', 'default')
    app.config.from_object(config[config_name])
    
    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    CORS(app, origins=app.config['CORS_ORIGINS'])
    
    # Configure logging
    if not app.debug:
        logging.basicConfig(level=logging.INFO)
        logger = logging.getLogger(__name__)
        logger.info('Neexa Backend API started')
    
    # JWT error handlers
    @jwt.expired_token_loader
    def expired_token_callback(jwt_header, jwt_payload):
        return jsonify({'error': 'Token has expired'}), 401
    
    @jwt.invalid_token_loader
    def invalid_token_callback(error):
        return jsonify({'error': 'Invalid token'}), 401
    
    @jwt.unauthorized_loader
    def missing_token_callback(error):
        return jsonify({'error': 'Authorization token is required'}), 401
    
    @jwt.needs_fresh_token_loader
    def token_not_fresh_callback(jwt_header, jwt_payload):
        return jsonify({'error': 'Fresh token required'}), 401
    
    # Register blueprints
    from app.routes import auth_bp, user_bp
    app.register_blueprint(auth_bp)
    app.register_blueprint(user_bp)
    
    # Health check endpoint
    @app.route('/health', methods=['GET'])
    def health_check():
        return jsonify({
            'status': 'healthy',
            'message': 'Neexa Backend API is running'
        }), 200
    
    # API info endpoint
    @app.route('/api', methods=['GET'])
    def api_info():
        return jsonify({
            'name': 'Neexa Backend API',
            'version': '1.0.0',
            'description': 'Backend API for Neexa financial application',
            'endpoints': {
                'auth': '/api/auth',
                'user': '/api/user',
                'health': '/health'
            }
        }), 200
    
    # Error handlers
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({'error': 'Endpoint not found'}), 404
    
    @app.errorhandler(405)
    def method_not_allowed(error):
        return jsonify({'error': 'Method not allowed'}), 405
    
    @app.errorhandler(500)
    def internal_error(error):
        db.session.rollback()
        return jsonify({'error': 'Internal server error'}), 500
    
    return app













