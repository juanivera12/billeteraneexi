// Mock API service for testing without backend
export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
  last_login?: string;
  preferred_currency: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  confirm_password: string;
  first_name: string;
  last_name: string;
  phone?: string;
  date_of_birth?: string;
  preferred_currency?: string;
}

export interface AuthResponse {
  message: string;
  user: User;
  access_token: string;
  refresh_token: string;
}

class MockApiService {
  private baseURL: string;
  private accessToken: string | null = null;

  constructor() {
    // Load token from localStorage on initialization
    this.accessToken = localStorage.getItem('access_token');
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock validation
    if (userData.password !== userData.confirm_password) {
      throw new Error('Las contraseñas no coinciden');
    }

    if (!userData.first_name.trim() || !userData.last_name.trim()) {
      throw new Error('El nombre y apellido son requeridos');
    }

    // Mock password validation
    if (userData.password.length < 8) {
      throw new Error('Password must be at least 8 characters long');
    }

    const mockUser: User = {
      id: Math.floor(Math.random() * 1000),
      email: userData.email,
      first_name: userData.first_name,
      last_name: userData.last_name,
      is_active: true,
      is_verified: true,
      created_at: new Date().toISOString(),
      preferred_currency: userData.preferred_currency || 'ARS'
    };

    const response: AuthResponse = {
      message: 'User registered successfully',
      user: mockUser,
      access_token: 'mock-access-token-' + Date.now(),
      refresh_token: 'mock-refresh-token-' + Date.now()
    };

    // Store tokens
    this.accessToken = response.access_token;
    localStorage.setItem('access_token', response.access_token);
    localStorage.setItem('refresh_token', response.refresh_token);
    localStorage.setItem('user', JSON.stringify(response.user));

    return response;
  }

  async login(credentials: LoginRequest): Promise<AuthResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock validation
    if (!credentials.email || !credentials.password) {
      throw new Error('Email y contraseña son requeridos');
    }

    // Mock user (you can change these credentials for testing)
    if (credentials.email === 'admin@neexa.com' && credentials.password === 'Admin123!') {
      const mockUser: User = {
        id: 1,
        email: 'admin@neexa.com',
        first_name: 'Admin',
        last_name: 'Neexa',
        is_active: true,
        is_verified: true,
        created_at: new Date().toISOString(),
        last_login: new Date().toISOString(),
        preferred_currency: 'ARS'
      };

      const response: AuthResponse = {
        message: 'Login successful',
        user: mockUser,
        access_token: 'mock-access-token-' + Date.now(),
        refresh_token: 'mock-refresh-token-' + Date.now()
      };

      // Store tokens
      this.accessToken = response.access_token;
      localStorage.setItem('access_token', response.access_token);
      localStorage.setItem('refresh_token', response.refresh_token);
      localStorage.setItem('user', JSON.stringify(response.user));

      return response;
    }

    // For any other credentials, also allow login (for testing)
    const mockUser: User = {
      id: Math.floor(Math.random() * 1000),
      email: credentials.email,
      first_name: 'Test',
      last_name: 'User',
      is_active: true,
      is_verified: true,
      created_at: new Date().toISOString(),
      last_login: new Date().toISOString(),
      preferred_currency: 'ARS'
    };

    const response: AuthResponse = {
      message: 'Login successful',
      user: mockUser,
      access_token: 'mock-access-token-' + Date.now(),
      refresh_token: 'mock-refresh-token-' + Date.now()
    };

    // Store tokens
    this.accessToken = response.access_token;
    localStorage.setItem('access_token', response.access_token);
    localStorage.setItem('refresh_token', response.refresh_token);
    localStorage.setItem('user', JSON.stringify(response.user));

    return response;
  }

  async logout(): Promise<void> {
    // Clear local storage
    this.accessToken = null;
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
  }

  async verifyToken(): Promise<boolean> {
    return !!this.accessToken;
  }

  isAuthenticated(): boolean {
    return !!this.accessToken;
  }

  getStoredUser(): User | null {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('user');
      }
    }
    return null;
  }

  clearStoredData(): void {
    this.accessToken = null;
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
  }
}

// Create and export a singleton instance
export const apiService = new MockApiService();
export default MockApiService;













