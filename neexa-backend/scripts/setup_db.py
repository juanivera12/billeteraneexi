#!/usr/bin/env python3
"""
Database setup script for Neexa Backend
Creates database tables and initial data
"""

import sys
import os

# Add the parent directory to the path so we can import the app
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app import create_app, db
from app.models.user import User

def setup_database():
    """Set up the database with tables and initial data"""
    app = create_app()
    
    with app.app_context():
        print("Creating database tables...")
        db.create_all()
        print("✓ Database tables created successfully!")
        
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
                print("✓ Admin user created successfully!")
                print("  Email: admin@neexa.com")
                print("  Password: Admin123!")
            except Exception as e:
                print(f"✗ Error creating admin user: {str(e)}")
                db.session.rollback()
        else:
            print("✓ Admin user already exists")
        
        # Show database info
        user_count = User.query.count()
        print(f"\nDatabase setup complete!")
        print(f"Total users in database: {user_count}")

if __name__ == '__main__':
    setup_database()













