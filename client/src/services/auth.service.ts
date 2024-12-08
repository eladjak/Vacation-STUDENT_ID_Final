import axiosInstance from './axios.config';
import { User } from '../types';

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterCredentials extends LoginCredentials {
  firstName: string;
  lastName: string;
}

interface AuthResponse {
  token: string;
  user: User;
}

class AuthService {
  constructor() {
    // Initialize token from localStorage if exists
    const token = localStorage.getItem('token');
    if (token) {
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      console.log('Attempting login with:', { email: credentials.email });
      const response = await axiosInstance.post<AuthResponse>('/auth/login', credentials);
      console.log('Login response:', response.data);
      if (response.data.token && response.data.user) {
        this.setSession(response.data);
      }
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      this.clearSession();
      throw error;
    }
  }

  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    try {
      console.log('Attempting registration with:', { email: credentials.email });
      const response = await axiosInstance.post<AuthResponse>('/auth/register', credentials);
      console.log('Registration response:', response.data);
      if (response.data.token && response.data.user) {
        this.setSession(response.data);
      }
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      this.clearSession();
      throw error;
    }
  }

  logout(): void {
    console.log('Logging out...');
    this.clearSession();
  }

  private setSession(authData: AuthResponse): void {
    console.log('Setting session data...', { token: authData.token?.substring(0, 20) + '...' });
    const token = authData.token;
    if (!token || !authData.user) {
      console.error('Invalid auth data:', { hasToken: !!token, hasUser: !!authData.user });
      throw new Error('Invalid authentication data');
    }
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(authData.user));
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    console.log('Session data set successfully:', { 
      userId: authData.user.id,
      role: authData.user.role
    });
  }

  private clearSession(): void {
    console.log('Clearing session data...');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axiosInstance.defaults.headers.common['Authorization'];
    console.log('Session data cleared successfully');
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    const isAuth = !!token && !!user;
    console.log('Auth check:', { 
      isAuth, 
      hasToken: !!token,
      hasUser: !!user,
      userId: user ? JSON.parse(user).id : null
    });
    return isAuth;
  }

  getUser(): User | null {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      this.clearSession();
      return null;
    }
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}

export const authService = new AuthService(); 