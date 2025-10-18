#!/usr/bin/env python3
"""
Servidor backend simple para Neexa
Lo hice así para que sea fácil de probar y entender
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
import sqlite3
import os
import re
from datetime import datetime, timedelta
import uuid
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

app = Flask(__name__)
CORS(app, origins=['http://localhost:3001', 'http://localhost:3000'])

# Configuración de la base de datos
DATABASE = 'neexa_simple.db'

def init_db():
    """Creo la base de datos y las tablas necesarias"""
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            first_name TEXT NOT NULL,
            last_name TEXT NOT NULL,
            is_active BOOLEAN DEFAULT 1,
            is_verified BOOLEAN DEFAULT 1,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            last_login TIMESTAMP
        )
    ''')
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS password_reset_tokens (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            token TEXT UNIQUE NOT NULL,
            expires_at TIMESTAMP NOT NULL,
            used BOOLEAN DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    ''')
    
    conn.commit()
    conn.close()

def validate_password(password):
    """Valido que la contraseña sea segura - tiene que tener mayúscula, número y símbolo"""
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

def validate_email(email):
    """Validate email format"""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def send_reset_email(email, reset_token, first_name):
    """Send password reset email"""
    # Para desarrollo, solo imprimimos el email en consola
    reset_link = f"http://localhost:3000/reset-password?token={reset_token}"
    
    print(f"\n{'='*50}")
    print(f"📧 EMAIL DE RECUPERACIÓN DE CONTRASEÑA")
    print(f"{'='*50}")
    print(f"Para: {email}")
    print(f"Nombre: {first_name}")
    print(f"Token: {reset_token}")
    print(f"Enlace: {reset_link}")
    print(f"{'='*50}\n")
    
    # Simular envío exitoso
    return True

@app.route('/', methods=['GET'])
def home():
    """Home endpoint"""
    return jsonify({
        "message": "Hello from Neexa Backend!",
        "version": "1.0.0",
        "endpoints": {
            "register": "/api/auth/register",
            "login": "/api/auth/login",
            "me": "/api/auth/me"
        }
    })

@app.route('/api/auth/register', methods=['POST'])
def register():
    """Register a new user"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        # Validate required fields
        required_fields = ['email', 'password', 'confirm_password', 'first_name', 'last_name']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'{field} is required'}), 400
        
        email = data['email'].lower().strip()
        password = data['password']
        confirm_password = data['confirm_password']
        first_name = data['first_name'].strip()
        last_name = data['last_name'].strip()
        
        # Validate email format
        if not validate_email(email):
            return jsonify({'error': 'Invalid email format'}), 400
        
        # Check if passwords match
        if password != confirm_password:
            return jsonify({'error': 'Passwords do not match'}), 400
        
        # Validate password strength
        is_valid, message = validate_password(password)
        if not is_valid:
            return jsonify({'error': message}), 400
        
        # Check if user already exists
        conn = sqlite3.connect(DATABASE)
        cursor = conn.cursor()
        
        cursor.execute('SELECT id FROM users WHERE email = ?', (email,))
        if cursor.fetchone():
            conn.close()
            return jsonify({'error': 'User with this email already exists'}), 409
        
        # Create new user
        password_hash = generate_password_hash(password)
        cursor.execute('''
            INSERT INTO users (email, password_hash, first_name, last_name)
            VALUES (?, ?, ?, ?)
        ''', (email, password_hash, first_name, last_name))
        
        user_id = cursor.lastrowid
        conn.commit()
        conn.close()
        
        # Generate simple token (in production, use JWT)
        token = str(uuid.uuid4())
        
        return jsonify({
            'message': 'User registered successfully',
            'user': {
                'id': user_id,
                'email': email,
                'first_name': first_name,
                'last_name': last_name,
                'is_active': True,
                'is_verified': True,
                'created_at': datetime.utcnow().isoformat() + 'Z',
                'preferred_currency': 'ARS'
            },
            'access_token': token,
            'refresh_token': token  # Simplified for testing
        }), 201
        
    except Exception as e:
        print(f"Error in register: {str(e)}")
        return jsonify({
            'error': True,
            'error_code': 'UNEXPECTED_ERROR',
            'error_id': str(uuid.uuid4())[:8],
            'error_message': 'Error inesperado del servidor',
            'timestamp': datetime.utcnow().isoformat() + 'Z'
        }), 500

@app.route('/api/auth/login', methods=['POST'])
def login():
    """Authenticate user login"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        email = data.get('email', '').lower().strip()
        password = data.get('password', '')
        
        if not email or not password:
            return jsonify({'error': 'Email and password are required'}), 400
        
        # Find user
        conn = sqlite3.connect(DATABASE)
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT id, email, password_hash, first_name, last_name, is_active
            FROM users WHERE email = ?
        ''', (email,))
        
        user = cursor.fetchone()
        
        if not user:
            conn.close()
            return jsonify({'error': 'Invalid email or password'}), 401
        
        user_id, user_email, password_hash, first_name, last_name, is_active = user
        
        if not is_active:
            conn.close()
            return jsonify({'error': 'Account is deactivated'}), 401
        
        # Check password
        if not check_password_hash(password_hash, password):
            conn.close()
            return jsonify({'error': 'Invalid email or password'}), 401
        
        # Update last login
        cursor.execute('''
            UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?
        ''', (user_id,))
        
        conn.commit()
        conn.close()
        
        # Generate simple token (in production, use JWT)
        token = str(uuid.uuid4())
        
        return jsonify({
            'message': 'Login successful',
            'user': {
                'id': user_id,
                'email': user_email,
                'first_name': first_name,
                'last_name': last_name,
                'is_active': True,
                'is_verified': True,
                'created_at': datetime.utcnow().isoformat() + 'Z',
                'preferred_currency': 'ARS'
            },
            'access_token': token,
            'refresh_token': token  # Simplified for testing
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Internal server error', 'details': str(e)}), 500

@app.route('/api/auth/me', methods=['GET'])
def get_user():
    """Get current user info (requires token)"""
    try:
        # For simplicity, we'll just return a mock user
        # In production, you'd validate the token here
        return jsonify({
            'user': {
                'id': 1,
                'email': 'test@example.com',
                'first_name': 'Test',
                'last_name': 'User'
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Internal server error', 'details': str(e)}), 500

@app.route('/api/auth/verify-token', methods=['POST'])
def verify_token():
    """Verify token (for frontend)"""
    try:
        data = request.get_json()
        token = data.get('token')
        
        if token:
            return jsonify({'valid': True}), 200
        else:
            return jsonify({'valid': False}), 401
            
    except Exception as e:
        return jsonify({'error': 'Internal server error', 'details': str(e)}), 500

@app.route('/api/auth/forgot-password', methods=['POST'])
def forgot_password():
    """Send password reset email"""
    try:
        data = request.get_json()
        
        if not data or 'email' not in data:
            return jsonify({'error': 'Email is required'}), 400
        
        email = data['email'].lower().strip()
        
        # Validate email format
        if not validate_email(email):
            return jsonify({'error': 'Invalid email format'}), 400
        
        # Check if user exists
        conn = sqlite3.connect(DATABASE)
        cursor = conn.cursor()
        
        cursor.execute('SELECT id, first_name FROM users WHERE email = ?', (email,))
        user = cursor.fetchone()
        
        if not user:
            conn.close()
            # Por seguridad, siempre devolvemos éxito aunque el email no exista
            return jsonify({'message': 'If the email exists, a reset link has been sent'}), 200
        
        user_id, first_name = user
        
        # Generate reset token
        reset_token = str(uuid.uuid4())
        expires_at = datetime.utcnow() + timedelta(hours=1)
        
        # Save reset token to database
        cursor.execute('''
            INSERT INTO password_reset_tokens (user_id, token, expires_at)
            VALUES (?, ?, ?)
        ''', (user_id, reset_token, expires_at))
        
        conn.commit()
        conn.close()
        
        # Send reset email
        print(f"About to send email to {email}")
        email_sent = send_reset_email(email, reset_token, first_name)
        print(f"Email sent result: {email_sent}")
        
        if email_sent:
            return jsonify({'message': 'If the email exists, a reset link has been sent'}), 200
        else:
            return jsonify({'error': 'Failed to send reset email'}), 500
        
    except Exception as e:
        print(f"Error in forgot_password: {str(e)}")
        return jsonify({
            'error': True,
            'error_code': 'UNEXPECTED_ERROR',
            'error_id': str(uuid.uuid4())[:8],
            'error_message': 'Error inesperado del servidor',
            'timestamp': datetime.utcnow().isoformat() + 'Z'
        }), 500

@app.route('/api/auth/reset-password', methods=['POST'])
def reset_password():
    """Reset password with token"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        token = data.get('token', '').strip()
        password = data.get('password', '')
        
        if not token or not password:
            return jsonify({'error': 'Token and password are required'}), 400
        
        # Validate password strength
        is_valid, message = validate_password(password)
        if not is_valid:
            return jsonify({'error': message}), 400
        
        # Check if token exists and is valid
        conn = sqlite3.connect(DATABASE)
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT prt.user_id, prt.expires_at, prt.used, u.email
            FROM password_reset_tokens prt
            JOIN users u ON prt.user_id = u.id
            WHERE prt.token = ?
        ''', (token,))
        
        token_data = cursor.fetchone()
        
        if not token_data:
            conn.close()
            return jsonify({'error': 'Invalid or expired token'}), 400
        
        user_id, expires_at, used, email = token_data
        
        # Check if token is expired
        if datetime.utcnow() > datetime.fromisoformat(expires_at):
            conn.close()
            return jsonify({'error': 'Token has expired'}), 400
        
        # Check if token has been used
        if used:
            conn.close()
            return jsonify({'error': 'Token has already been used'}), 400
        
        # Update password
        password_hash = generate_password_hash(password)
        cursor.execute('UPDATE users SET password_hash = ? WHERE id = ?', (password_hash, user_id))
        
        # Mark token as used
        cursor.execute('UPDATE password_reset_tokens SET used = 1 WHERE token = ?', (token,))
        
        conn.commit()
        conn.close()
        
        return jsonify({'message': 'Password has been reset successfully'}), 200
        
    except Exception as e:
        print(f"Error in reset_password: {str(e)}")
        return jsonify({
            'error': True,
            'error_code': 'UNEXPECTED_ERROR',
            'error_id': str(uuid.uuid4())[:8],
            'error_message': 'Error inesperado del servidor',
            'timestamp': datetime.utcnow().isoformat() + 'Z'
        }), 500

@app.route('/api/auth/verify-reset-token', methods=['POST'])
def verify_reset_token():
    """Verify if reset token is valid"""
    try:
        data = request.get_json()
        
        if not data or 'token' not in data:
            return jsonify({'error': 'Token is required'}), 400
        
        token = data['token'].strip()
        
        # Check if token exists and is valid
        conn = sqlite3.connect(DATABASE)
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT expires_at, used
            FROM password_reset_tokens
            WHERE token = ?
        ''', (token,))
        
        token_data = cursor.fetchone()
        conn.close()
        
        if not token_data:
            return jsonify({'valid': False, 'message': 'Invalid token'}), 400
        
        expires_at, used = token_data
        
        # Check if token is expired
        if datetime.utcnow() > datetime.fromisoformat(expires_at):
            return jsonify({'valid': False, 'message': 'Token has expired'}), 400
        
        # Check if token has been used
        if used:
            return jsonify({'valid': False, 'message': 'Token has already been used'}), 400
        
        return jsonify({'valid': True, 'message': 'Token is valid'}), 200
        
    except Exception as e:
        print(f"Error in verify_reset_token: {str(e)}")
        return jsonify({
            'error': True,
            'error_code': 'UNEXPECTED_ERROR',
            'error_id': str(uuid.uuid4())[:8],
            'error_message': 'Error inesperado del servidor',
            'timestamp': datetime.utcnow().isoformat() + 'Z'
        }), 500

if __name__ == '__main__':
    print("Initializing database...")
    init_db()
    print("Database initialized!")
    
    print("Starting Neexa Simple Backend Server...")
    print("Server will run on http://localhost:5000")
    
    app.run(
        host='0.0.0.0',
        port=5000,
        debug=True
    )
