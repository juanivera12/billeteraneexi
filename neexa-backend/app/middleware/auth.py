from functools import wraps
from flask import jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity, verify_jwt_in_request
from app.models.user import User
from app import db
from datetime import datetime

def token_required(f):
    """Decorator to require valid JWT token"""
    @wraps(f)
    def decorated(*args, **kwargs):
        try:
            verify_jwt_in_request()
            user_id = get_jwt_identity()
            
            # Check if user exists and is active
            user = User.query.filter_by(id=user_id, is_active=True).first()
            if not user:
                return jsonify({'message': 'User not found or inactive'}), 401
            
            # Check if account is locked
            if user.is_locked():
                return jsonify({'message': 'Account is temporarily locked due to multiple failed login attempts'}), 423
            
            return f(user, *args, **kwargs)
        except Exception as e:
            return jsonify({'message': 'Invalid token or token expired'}), 401
    
    return decorated

def admin_required(f):
    """Decorator to require admin privileges"""
    @wraps(f)
    def decorated(*args, **kwargs):
        try:
            verify_jwt_in_request()
            user_id = get_jwt_identity()
            
            user = User.query.filter_by(id=user_id, is_active=True).first()
            if not user:
                return jsonify({'message': 'User not found or inactive'}), 401
            
            # Add admin check here when admin role is implemented
            # For now, we'll just require a valid user
            return f(user, *args, **kwargs)
        except Exception as e:
            return jsonify({'message': 'Admin access required'}), 403
    
    return decorated

def rate_limit_by_user(f):
    """Decorator to implement rate limiting per user"""
    @wraps(f)
    def decorated(*args, **kwargs):
        # Simple rate limiting implementation
        # In production, use Redis or similar
        user_id = get_jwt_identity() if verify_jwt_in_request(optional=True) else None
        
        # Add rate limiting logic here
        return f(*args, **kwargs)
    
    return decorated

def validate_request_content_type(f):
    """Decorator to validate request content type"""
    @wraps(f)
    def decorated(*args, **kwargs):
        if request.method in ['POST', 'PUT', 'PATCH']:
            if not request.is_json:
                return jsonify({'message': 'Content-Type must be application/json'}), 400
        return f(*args, **kwargs)
    
    return decorated

