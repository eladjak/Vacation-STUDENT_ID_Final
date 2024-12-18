/**
 * Type Definitions
 * 
 * Central type definitions for the application
 * Features:
 * - User-related types
 * - Vacation-related types
 * - Authentication types
 * - Form types
 * - API response types
 * - Redux state types
 */

/**
 * User role type
 */
export type UserRole = 'user' | 'admin';

/**
 * User interface
 */
export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
}

/**
 * Vacation interface
 */
export interface Vacation {
  id: number;
  destination: string;
  description: string;
  startDate: string;
  endDate: string;
  price: number;
  imageUrl: string | null;
  isFollowing?: boolean;
  followersCount: number;
}

/**
 * Login credentials interface
 */
export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * Registration credentials interface
 */
export interface RegisterCredentials {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

/**
 * Vacation form values interface
 */
export interface VacationFormValues {
  destination: string;
  description: string;
  startDate: Date | null;
  endDate: Date | null;
  price: number;
  image: File | null;
}

/**
 * API response interface for authentication
 */
export interface AuthResponse {
  user: User;
  token: string;
}

/**
 * API error response interface
 */
export interface ApiError {
  message: string;
  statusCode: number;
}

/**
 * Router blocker function type
 */
export interface BlockerFunction {
  currentLocation: {
    pathname: string;
  };
  nextLocation: {
    pathname: string;
  } | null;
}

/**
 * Form submission status interface
 */
export interface FormStatus {
  success: boolean;
  message: string | null;
}

/**
 * Vacation statistics interface
 */
export interface VacationStats {
  destination: string;
  followers: number;
}

/**
 * Sort options for vacations
 */
export type SortOption = 'date' | 'price' | 'followers' | 'destination';

/**
 * Sort direction
 */
export type SortDirection = 'asc' | 'desc'; 