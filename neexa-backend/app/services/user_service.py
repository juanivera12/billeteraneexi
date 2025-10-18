from app.models.user import User
from app import db
from app.schemas.user_schema import (
    UserRegistrationSchema, 
    UserLoginSchema, 
    UserUpdateSchema,
    PasswordChangeSchema
)
from marshmallow import ValidationError
from datetime import datetime
import logging

logger = logging.getLogger(__name__)

class UserService:
    """Service class for user operations"""
    
    @staticmethod
    def register_user(user_data):
        """Register a new user"""
        try:
            # Validate input data
            schema = UserRegistrationSchema()
            validated_data = schema.load(user_data)
            
            # Check if passwords match
            if validated_data['password'] != validated_data['confirm_password']:
                return {'error': 'Passwords do not match'}, 400
            
            # Check if user already exists
            existing_user = User.query.filter_by(email=validated_data['email']).first()
            if existing_user:
                return {'error': 'User with this email already exists'}, 409
            
            # Create new user
            user = User(
                email=validated_data['email'],
                password=validated_data['password'],
                first_name=validated_data['first_name'],
                last_name=validated_data['last_name'],
                phone=validated_data.get('phone'),
                date_of_birth=validated_data.get('date_of_birth'),
                preferred_currency=validated_data.get('preferred_currency', 'ARS')
            )
            
            db.session.add(user)
            db.session.commit()
            
            logger.info(f"New user registered: {user.email}")
            
            # Generate tokens
            access_token, refresh_token = user.generate_tokens()
            
            return {
                'message': 'User registered successfully',
                'user': user.to_dict(),
                'access_token': access_token,
                'refresh_token': refresh_token
            }, 201
            
        except ValidationError as e:
            logger.warning(f"Validation error during registration: {e.messages}")
            return {'error': 'Validation failed', 'details': e.messages}, 400
        except Exception as e:
            logger.error(f"Error during user registration: {str(e)}")
            db.session.rollback()
            return {'error': 'Internal server error'}, 500
    
    @staticmethod
    def login_user(login_data):
        """Authenticate user login"""
        try:
            # Validate input data
            schema = UserLoginSchema()
            validated_data = schema.load(login_data)
            
            # Find user by email
            user = User.query.filter_by(email=validated_data['email']).first()
            
            if not user:
                return {'error': 'Invalid email or password'}, 401
            
            # Check if account is locked
            if user.is_locked():
                return {'error': 'Account is temporarily locked due to multiple failed login attempts'}, 423
            
            # Check if user is active
            if not user.is_active:
                return {'error': 'Account is deactivated'}, 401
            
            # Verify password
            if not user.check_password(validated_data['password']):
                user.increment_login_attempts()
                return {'error': 'Invalid email or password'}, 401
            
            # Successful login
            user.update_login_info()
            
            # Generate tokens
            access_token, refresh_token = user.generate_tokens()
            
            logger.info(f"User logged in successfully: {user.email}")
            
            return {
                'message': 'Login successful',
                'user': user.to_dict(),
                'access_token': access_token,
                'refresh_token': refresh_token
            }, 200
            
        except ValidationError as e:
            logger.warning(f"Validation error during login: {e.messages}")
            return {'error': 'Validation failed', 'details': e.messages}, 400
        except Exception as e:
            logger.error(f"Error during user login: {str(e)}")
            return {'error': 'Internal server error'}, 500
    
    @staticmethod
    def get_user_profile(user_id):
        """Get user profile by ID"""
        try:
            user = User.query.filter_by(id=user_id, is_active=True).first()
            
            if not user:
                return {'error': 'User not found'}, 404
            
            return {'user': user.to_dict()}, 200
            
        except Exception as e:
            logger.error(f"Error getting user profile: {str(e)}")
            return {'error': 'Internal server error'}, 500
    
    @staticmethod
    def update_user_profile(user_id, update_data):
        """Update user profile"""
        try:
            user = User.query.filter_by(id=user_id, is_active=True).first()
            
            if not user:
                return {'error': 'User not found'}, 404
            
            # Validate input data
            schema = UserUpdateSchema()
            validated_data = schema.load(update_data)
            
            # Update user fields
            for field, value in validated_data.items():
                if value is not None:
                    setattr(user, field, value)
            
            user.updated_at = datetime.utcnow()
            db.session.commit()
            
            logger.info(f"User profile updated: {user.email}")
            
            return {
                'message': 'Profile updated successfully',
                'user': user.to_dict()
            }, 200
            
        except ValidationError as e:
            logger.warning(f"Validation error during profile update: {e.messages}")
            return {'error': 'Validation failed', 'details': e.messages}, 400
        except Exception as e:
            logger.error(f"Error updating user profile: {str(e)}")
            db.session.rollback()
            return {'error': 'Internal server error'}, 500
    
    @staticmethod
    def change_password(user_id, password_data):
        """Change user password"""
        try:
            user = User.query.filter_by(id=user_id, is_active=True).first()
            
            if not user:
                return {'error': 'User not found'}, 404
            
            # Validate input data
            schema = PasswordChangeSchema()
            validated_data = schema.load(password_data)
            
            # Check if passwords match
            if validated_data['new_password'] != validated_data['confirm_new_password']:
                return {'error': 'New passwords do not match'}, 400
            
            # Verify current password
            if not user.check_password(validated_data['current_password']):
                return {'error': 'Current password is incorrect'}, 401
            
            # Check if new password is different from current
            if user.check_password(validated_data['new_password']):
                return {'error': 'New password must be different from current password'}, 400
            
            # Update password
            user.set_password(validated_data['new_password'])
            user.updated_at = datetime.utcnow()
            db.session.commit()
            
            logger.info(f"Password changed for user: {user.email}")
            
            return {'message': 'Password changed successfully'}, 200
            
        except ValidationError as e:
            logger.warning(f"Validation error during password change: {e.messages}")
            return {'error': 'Validation failed', 'details': e.messages}, 400
        except ValueError as e:
            return {'error': str(e)}, 400
        except Exception as e:
            logger.error(f"Error changing password: {str(e)}")
            db.session.rollback()
            return {'error': 'Internal server error'}, 500
    
    @staticmethod
    def deactivate_user(user_id):
        """Deactivate user account"""
        try:
            user = User.query.filter_by(id=user_id, is_active=True).first()
            
            if not user:
                return {'error': 'User not found'}, 404
            
            user.is_active = False
            user.updated_at = datetime.utcnow()
            db.session.commit()
            
            logger.info(f"User account deactivated: {user.email}")
            
            return {'message': 'Account deactivated successfully'}, 200
            
        except Exception as e:
            logger.error(f"Error deactivating user: {str(e)}")
            db.session.rollback()
            return {'error': 'Internal server error'}, 500




