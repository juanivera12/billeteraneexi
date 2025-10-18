#!/usr/bin/env python3
"""
Neexa Backend API
Financial application backend with user authentication and security features.
"""

import os
from app import create_app, db
from app.models.user import User

# Create Flask application
app = create_app()

@app.shell_context_processor
def make_shell_context():
    """Make database and models available in shell context"""
    return {'db': db, 'User': User}

@app.cli.command()
def init_db():
    """Initialize the database"""
    db.create_all()
    print("Database initialized successfully!")

@app.cli.command()
def create_admin():
    """Create an admin user"""
    email = input("Enter admin email: ")
    password = input("Enter admin password: ")
    first_name = input("Enter admin first name: ")
    last_name = input("Enter admin last name: ")
    
    try:
        admin = User(
            email=email,
            password=password,
            first_name=first_name,
            last_name=last_name
        )
        admin.is_verified = True
        db.session.add(admin)
        db.session.commit()
        print(f"Admin user created successfully: {email}")
    except Exception as e:
        print(f"Error creating admin user: {str(e)}")
        db.session.rollback()

if __name__ == '__main__':
    # Run the application
    port = int(os.environ.get('PORT', 5001))  # Cambiar a puerto 5001
    debug = os.environ.get('FLASK_ENV') == 'development'
    
    print(f"Starting Neexa Backend API on port {port}")
    print(f"Debug mode: {debug}")
    
    app.run(
        host='0.0.0.0',
        port=port,
        debug=debug
    )




