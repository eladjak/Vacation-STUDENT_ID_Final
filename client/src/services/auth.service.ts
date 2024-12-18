/**
 * Authentication Service
 * 
 * Handles all authentication-related API calls and token management
 * Features:
 * - User registration
 * - User login
 * - Token management
 * - Session persistence
 * - Error handling
 */

import axios from './axios.config';
import { LoginCredentials, RegisterData, User } from '../types/auth';

// API endpoints
const AUTH_API = {
  REGISTER: '/auth/register',
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  VERIFY: '/auth/verify'
};

// Token management
const TOKEN_KEY = 'authToken';

/**
 * Stores authentication token in localStorage
 * @param token JWT token
 */
const setToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

/**
 * Removes authentication token from localStorage
 */
const removeToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
  delete axios.defaults.headers.common['Authorization'];
};

/**
 * Retrieves stored token from localStorage
 * @returns Stored JWT token or null
 */
const getStoredToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

/**
 * Registers a new user
 * @param data User registration data
 * @returns Registered user data and token
 */
const register = async (data: RegisterData): Promise<{ user: User; token: string }> => {
  try {
    const response = await axios.post(AUTH_API.REGISTER, data);
    const { user, token } = response.data;
    setToken(token);
    return { user, token };
  } catch (error) {
    throw error;
  }
};

/**
 * Authenticates user credentials
 * @param credentials User login credentials
 * @returns Authenticated user data and token
 */
const login = async (credentials: LoginCredentials): Promise<{ user: User; token: string }> => {
  try {
    const response = await axios.post(AUTH_API.LOGIN, credentials);
    const { user, token } = response.data;
    setToken(token);
    return { user, token };
  } catch (error) {
    throw error;
  }
};

/**
 * Logs out the current user
 */
const logout = async (): Promise<void> => {
  try {
    await axios.post(AUTH_API.LOGOUT);
    removeToken();
  } catch (error) {
    throw error;
  }
};

/**
 * Verifies current authentication token
 * @returns User data if token is valid
 */
const verifyToken = async (): Promise<User | null> => {
  const token = getStoredToken();
  if (!token) return null;

  try {
    const response = await axios.get(AUTH_API.VERIFY);
    return response.data.user;
  } catch (error) {
    removeToken();
    return null;
  }
};

export const authService = {
  register,
  login,
  logout,
  verifyToken,
  getStoredToken,
  setToken,
  removeToken
}; 