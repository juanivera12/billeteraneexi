#!/usr/bin/env python3
"""
Aplicación Flask simple para Neexa Backend
"""

import os
from flask import Flask, jsonify, request
from flask_cors import CORS

# Crear aplicación Flask
app = Flask(__name__)
CORS(app, origins=['http://localhost:3001', 'http://localhost:3000'])

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy',
        'message': 'Neexa Backend API is running'
    }), 200

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

@app.route('/api/auth/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        
        # Extraer credenciales
        email = data.get('email', '')
        password = data.get('password', '')
        
        # Validaciones básicas
        if not email or not password:
            return jsonify({
                'error': 'Email y contraseña son requeridos'
            }), 400
        
        # Simular login exitoso (en una app real, verificarías las credenciales)
        user_id = hash(email) % 10000
        
        return jsonify({
            'message': 'Login exitoso',
            'user': {
                'id': user_id,
                'email': email,
                'first_name': email.split('@')[0].title(),  # Usar parte del email como nombre
                'last_name': 'Usuario',
                'is_active': True,
                'is_verified': True,
                'created_at': '2025-10-20T00:00:00Z',
                'preferred_currency': 'ARS'
            },
            'access_token': f'fake-token-{user_id}',
            'refresh_token': f'fake-refresh-token-{user_id}'
        }), 200
        
    except Exception as e:
        return jsonify({
            'error': f'Error en el servidor: {str(e)}'
        }), 500

@app.route('/api/auth/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        
        # Extraer datos del usuario
        email = data.get('email', '')
        first_name = data.get('first_name', '')
        last_name = data.get('last_name', '')
        password = data.get('password', '')
        
        # Validaciones básicas
        if not email or not first_name or not last_name or not password:
            return jsonify({
                'error': 'Todos los campos son requeridos'
            }), 400
        
        # Simular creación de usuario con datos reales
        user_id = hash(email) % 10000  # Generar ID único basado en email
        
        return jsonify({
            'message': 'Usuario registrado exitosamente',
            'user': {
                'id': user_id,
                'email': email,
                'first_name': first_name,
                'last_name': last_name,
                'is_active': True,
                'is_verified': True,
                'created_at': '2025-10-20T00:00:00Z',
                'preferred_currency': 'ARS'
            },
            'access_token': f'fake-token-{user_id}',
            'refresh_token': f'fake-refresh-token-{user_id}'
        }), 201
        
    except Exception as e:
        return jsonify({
            'error': f'Error en el servidor: {str(e)}'
        }), 500

if __name__ == '__main__':
    print("Starting Neexa Backend API...")
    print("API will be available at: http://localhost:5000")
    print("Health check: http://localhost:5000/health")
    
    app.run(
        host='0.0.0.0',
        port=5000,
        debug=True
    )













