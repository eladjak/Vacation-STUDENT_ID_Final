/**
 * Private Route Component
 * 
 * Route wrapper that ensures user authentication
 * Features:
 * - Authentication check
 * - Automatic redirect to login
 * - Protected route access
 * 
 * Usage:
 * ```tsx
 * <PrivateRoute>
 *   <ProtectedComponent />
 * </PrivateRoute>
 * ```
 */

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../../hooks/redux';

/**
 * Props interface for PrivateRoute component
 */
interface PrivateRouteProps {
  children: React.ReactNode;
}

/**
 * PrivateRoute Component
 * 
 * Protects routes from unauthorized access
 * Redirects to login page if user is not authenticated
 * 
 * @param props.children - Components to render if authenticated
 * @returns Protected route or redirect to login
 */
const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

export default PrivateRoute; 