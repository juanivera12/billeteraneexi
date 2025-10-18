// Servicio para conectarse con el backend real
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

class RealApiService {
  private baseURL: string;
  private accessToken: string | null = null;

  constructor() {
    this.baseURL = 'http://localhost:5000/api';
    // Cargo el token del localStorage al inicializar
    this.accessToken = localStorage.getItem('access_token');
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    try {
      console.log('Attempting to register:', userData);
      const response = await fetch(`${this.baseURL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      console.log('Register response status:', response.status);
      const data = await response.json();
      console.log('Register response data:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Error al registrarse');
      }

      // Store tokens
      this.accessToken = data.access_token;
      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('refresh_token', data.refresh_token);
      localStorage.setItem('user', JSON.stringify(data.user));

      return data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      console.log('Attempting to login:', credentials);
      const response = await fetch(`${this.baseURL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      console.log('Login response status:', response.status);
      const data = await response.json();
      console.log('Login response data:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Error al iniciar sesión');
      }

      // Store tokens
      this.accessToken = data.access_token;
      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('refresh_token', data.refresh_token);
      localStorage.setItem('user', JSON.stringify(data.user));

      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      // Clear local storage
      this.accessToken = null;
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }

  async verifyToken(): Promise<boolean> {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) return false;

      const response = await fetch(`${this.baseURL}/auth/verify-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();
      return data.valid || false;
    } catch (error) {
      console.error('Token verification error:', error);
      return false;
    }
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

  async forgotPassword(email: string): Promise<{ message: string }> {
    try {
      console.log('Requesting password reset for:', email);
      const response = await fetch(`${this.baseURL}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      console.log('Forgot password response status:', response.status);
      const data = await response.json();
      console.log('Forgot password response data:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Error al solicitar recuperación de contraseña');
      }

      return data;
    } catch (error) {
      console.error('Forgot password error:', error);
      throw error;
    }
  }

  async resetPassword(token: string, password: string): Promise<{ message: string }> {
    try {
      console.log('Resetting password with token');
      const response = await fetch(`${this.baseURL}/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, password }),
      });

      console.log('Reset password response status:', response.status);
      const data = await response.json();
      console.log('Reset password response data:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Error al restablecer contraseña');
      }

      return data;
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    }
  }

  async verifyResetToken(token: string): Promise<{ valid: boolean; message: string }> {
    try {
      console.log('Verifying reset token');
      const response = await fetch(`${this.baseURL}/auth/verify-reset-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      console.log('Verify token response status:', response.status);
      const data = await response.json();
      console.log('Verify token response data:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Error al verificar token');
      }

      return data;
    } catch (error) {
      console.error('Verify token error:', error);
      throw error;
    }
  }

  // Helper method to make authenticated requests
  async authenticatedRequest(url: string, options: RequestInit = {}): Promise<any> {
    const token = localStorage.getItem('access_token');
    
    const defaultOptions: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    };

    const response = await fetch(url, defaultOptions);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Request failed');
    }

    return data;
  }
}

// Create and export a singleton instance
export const apiService = new RealApiService();
export default RealApiService;
