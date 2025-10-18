#!/usr/bin/env python3
"""
Aplicación Flask simple para Neexa Backend
"""

import os
from flask import Flask, jsonify
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
    return jsonify({
        'message': 'Login endpoint - backend connected!',
        'user': {
            'id': 1,
            'email': 'test@example.com',
            'first_name': 'Test',
            'last_name': 'User'
        },
        'access_token': 'fake-token-for-testing',
        'refresh_token': 'fake-refresh-token'
    }), 200

@app.route('/api/auth/register', methods=['POST'])
def register():
    return jsonify({
        'message': 'Register endpoint - backend connected!',
        'user': {
            'id': 2,
            'email': 'newuser@example.com',
            'first_name': 'New',
            'last_name': 'User'
        },
        'access_token': 'fake-token-for-testing',
        'refresh_token': 'fake-refresh-token'
    }), 201

if __name__ == '__main__':
    print("Starting Neexa Backend API...")
    print("API will be available at: http://localhost:5000")
    print("Health check: http://localhost:5000/health")
    
    app.run(
        host='0.0.0.0',
        port=5000,
        debug=True
    )











