import unittest
import json
from app import create_app, db
from app.models.user import User

class AuthTestCase(unittest.TestCase):
    """Test cases for authentication endpoints"""
    
    def setUp(self):
        """Set up test client and database"""
        self.app = create_app('testing')
        self.app_context = self.app.app_context()
        self.app_context.push()
        self.client = self.app.test_client()
        
        # Create test database
        db.create_all()
        
        # Test user data
        self.test_user = {
            'email': 'test@example.com',
            'password': 'TestPass123!',
            'confirm_password': 'TestPass123!',
            'first_name': 'Test',
            'last_name': 'User'
        }
    
    def tearDown(self):
        """Clean up after tests"""
        db.session.remove()
        db.drop_all()
        self.app_context.pop()
    
    def test_user_registration_success(self):
        """Test successful user registration"""
        response = self.client.post('/api/auth/register',
                                  data=json.dumps(self.test_user),
                                  content_type='application/json')
        
        self.assertEqual(response.status_code, 201)
        data = json.loads(response.data)
        self.assertIn('access_token', data)
        self.assertIn('refresh_token', data)
        self.assertEqual(data['user']['email'], self.test_user['email'])
    
    def test_user_registration_duplicate_email(self):
        """Test registration with duplicate email"""
        # Register first user
        self.client.post('/api/auth/register',
                        data=json.dumps(self.test_user),
                        content_type='application/json')
        
        # Try to register with same email
        response = self.client.post('/api/auth/register',
                                  data=json.dumps(self.test_user),
                                  content_type='application/json')
        
        self.assertEqual(response.status_code, 409)
        data = json.loads(response.data)
        self.assertIn('already exists', data['error'])
    
    def test_user_registration_weak_password(self):
        """Test registration with weak password"""
        weak_password_user = self.test_user.copy()
        weak_password_user['password'] = 'weak'
        weak_password_user['confirm_password'] = 'weak'
        
        response = self.client.post('/api/auth/register',
                                  data=json.dumps(weak_password_user),
                                  content_type='application/json')
        
        self.assertEqual(response.status_code, 400)
        data = json.loads(response.data)
        self.assertIn('Password must be at least 8 characters', data['error'])
    
    def test_user_login_success(self):
        """Test successful user login"""
        # Register user first
        self.client.post('/api/auth/register',
                        data=json.dumps(self.test_user),
                        content_type='application/json')
        
        # Login
        login_data = {
            'email': self.test_user['email'],
            'password': self.test_user['password']
        }
        
        response = self.client.post('/api/auth/login',
                                  data=json.dumps(login_data),
                                  content_type='application/json')
        
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertIn('access_token', data)
        self.assertIn('refresh_token', data)
    
    def test_user_login_invalid_credentials(self):
        """Test login with invalid credentials"""
        login_data = {
            'email': 'nonexistent@example.com',
            'password': 'wrongpassword'
        }
        
        response = self.client.post('/api/auth/login',
                                  data=json.dumps(login_data),
                                  content_type='application/json')
        
        self.assertEqual(response.status_code, 401)
        data = json.loads(response.data)
        self.assertIn('Invalid email or password', data['error'])
    
    def test_protected_endpoint_without_token(self):
        """Test accessing protected endpoint without token"""
        response = self.client.get('/api/auth/me')
        self.assertEqual(response.status_code, 401)
    
    def test_protected_endpoint_with_valid_token(self):
        """Test accessing protected endpoint with valid token"""
        # Register and login to get token
        self.client.post('/api/auth/register',
                        data=json.dumps(self.test_user),
                        content_type='application/json')
        
        login_data = {
            'email': self.test_user['email'],
            'password': self.test_user['password']
        }
        
        login_response = self.client.post('/api/auth/login',
                                        data=json.dumps(login_data),
                                        content_type='application/json')
        
        token = json.loads(login_response.data)['access_token']
        
        # Access protected endpoint
        headers = {'Authorization': f'Bearer {token}'}
        response = self.client.get('/api/auth/me', headers=headers)
        
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertEqual(data['user']['email'], self.test_user['email'])

if __name__ == '__main__':
    unittest.main()













