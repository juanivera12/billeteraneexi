from flask import Blueprint, request, jsonify
from app.services.user_service import UserService
from app.middleware.auth import token_required, validate_request_content_type
import logging

logger = logging.getLogger(__name__)

user_bp = Blueprint('user', __name__, url_prefix='/api/user')

@user_bp.route('/profile', methods=['GET'])
@token_required
def get_profile(user):
    """Get user profile"""
    try:
        response, status_code = UserService.get_user_profile(user.id)
        return jsonify(response), status_code
        
    except Exception as e:
        logger.error(f"Unexpected error getting profile: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@user_bp.route('/profile', methods=['PUT'])
@token_required
@validate_request_content_type
def update_profile(user):
    """Update user profile"""
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        response, status_code = UserService.update_user_profile(user.id, data)
        return jsonify(response), status_code
        
    except Exception as e:
        logger.error(f"Unexpected error updating profile: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@user_bp.route('/change-password', methods=['POST'])
@token_required
@validate_request_content_type
def change_password(user):
    """Change user password"""
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        response, status_code = UserService.change_password(user.id, data)
        return jsonify(response), status_code
        
    except Exception as e:
        logger.error(f"Unexpected error changing password: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@user_bp.route('/deactivate', methods=['POST'])
@token_required
def deactivate_account(user):
    """Deactivate user account"""
    try:
        response, status_code = UserService.deactivate_user(user.id)
        return jsonify(response), status_code
        
    except Exception as e:
        logger.error(f"Unexpected error deactivating account: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500













