#!/usr/bin/env python3
"""
Script simple para inicializar la base de datos SQLite
"""

import os
import sys

# Establecer la configuración de desarrollo
os.environ['FLASK_ENV'] = 'development'
os.environ['DEV_DATABASE_URL'] = 'sqlite:///neexa_dev.db'

from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash
from datetime import datetime

# Crear aplicación Flask
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///neexa_dev.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'neexa-dev-secret-key-2024'

# Inicializar SQLAlchemy
db = SQLAlchemy(app)

# Definir el modelo User directamente aquí
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
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        """Check if the provided password matches the user's password"""
        from werkzeug.security import check_password_hash
        return check_password_hash(self.password_hash, password)
    
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

def setup_database():
    """Set up the database with tables and initial data"""
    with app.app_context():
        print("Creating database tables...")
        db.create_all()
        print("Database tables created successfully!")
        
        # Check if admin user already exists
        admin_user = User.query.filter_by(email='admin@neexa.com').first()
        
        if not admin_user:
            print("Creating admin user...")
            try:
                admin = User(
                    email='admin@neexa.com',
                    password='Admin123!',
                    first_name='Admin',
                    last_name='Neexa'
                )
                admin.is_verified = True
                db.session.add(admin)
                db.session.commit()
                print("Admin user created successfully!")
                print("  Email: admin@neexa.com")
                print("  Password: Admin123!")
            except Exception as e:
                print(f"Error creating admin user: {str(e)}")
                db.session.rollback()
        else:
            print("Admin user already exists")
        
        # Show database info
        user_count = User.query.count()
        print(f"\nDatabase setup complete!")
        print(f"Total users in database: {user_count}")

if __name__ == '__main__':
    setup_database()













