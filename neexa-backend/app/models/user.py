from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, create_refresh_token
import re

# db will be imported from app.__init__
from app import db

class User(db.Model):
    """User model for authentication and user management"""
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    is_active = db.Column(db.Boolean, default=True, nullable=False)
    is_verified = db.Column(db.Boolean, default=False, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    last_login = db.Column(db.DateTime)
    login_attempts = db.Column(db.Integer, default=0)
    locked_until = db.Column(db.DateTime)
    
    # Profile information
    phone = db.Column(db.String(20))
    date_of_birth = db.Column(db.Date)
    preferred_currency = db.Column(db.String(3), default='ARS')
    
    def __init__(self, email, password, first_name, last_name, **kwargs):
        self.email = email.lower().strip()
        self.set_password(password)
        self.first_name = first_name.strip()
        self.last_name = last_name.strip()
        
        # Set additional fields
        for key, value in kwargs.items():
            if hasattr(self, key):
                setattr(self, key, value)
    
    def set_password(self, password):
        """Hash and set the user's password"""
        if not self.validate_password(password):
            raise ValueError("Password does not meet security requirements")
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        """Check if the provided password matches the user's password"""
        return check_password_hash(self.password_hash, password)
    
    @staticmethod
    def validate_password(password):
        """Validate password strength"""
        if len(password) < 8:
            return False, "Password must be at least 8 characters long"
        
        if not re.search(r'[A-Z]', password):
            return False, "Password must contain at least one uppercase letter"
        
        if not re.search(r'[a-z]', password):
            return False, "Password must contain at least one lowercase letter"
        
        if not re.search(r'\d', password):
            return False, "Password must contain at least one digit"
        
        if not re.search(r'[!@#$%^&*(),.?":{}|<>]', password):
            return False, "Password must contain at least one special character"
        
        return True, "Password is valid"
    
    @staticmethod
    def validate_email(email):
        """Validate email format"""
        pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        return re.match(pattern, email) is not None
    
    def generate_tokens(self):
        """Generate access and refresh tokens for the user"""
        access_token = create_access_token(
            identity=self.id,
            additional_claims={
                'email': self.email,
                'first_name': self.first_name,
                'last_name': self.last_name
            }
        )
        refresh_token = create_refresh_token(identity=self.id)
        return access_token, refresh_token
    
    def update_login_info(self):
        """Update last login timestamp and reset login attempts"""
        self.last_login = datetime.utcnow()
        self.login_attempts = 0
        self.locked_until = None
        db.session.commit()
    
    def increment_login_attempts(self):
        """Increment failed login attempts"""
        self.login_attempts += 1
        
        # Lock account after 5 failed attempts for 30 minutes
        if self.login_attempts >= 5:
            from datetime import timedelta
            self.locked_until = datetime.utcnow() + timedelta(minutes=30)
        
        db.session.commit()
    
    def is_locked(self):
        """Check if the account is currently locked"""
        if self.locked_until:
            return datetime.utcnow() < self.locked_until
        return False
    
    def to_dict(self):
        """Convert user to dictionary for API responses"""
        return {
            'id': self.id,
            'email': self.email,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'is_active': self.is_active,
            'is_verified': self.is_verified,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'last_login': self.last_login.isoformat() if self.last_login else None,
            'preferred_currency': self.preferred_currency
        }
    
    def __repr__(self):
        return f'<User {self.email}>'
