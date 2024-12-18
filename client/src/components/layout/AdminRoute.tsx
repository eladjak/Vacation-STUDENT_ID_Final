/**
 * Admin Route Component
 * 
 * Route wrapper that ensures user has admin privileges
 * Features:
 * - Authentication check
 * - Admin role verification
 * - Automatic redirect to login
 * - Protected admin route access
 * 
 * Usage:
 * ```tsx
 * <AdminRoute>
 *   <AdminComponent />
 * </AdminRoute>
 * ```
 */

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../../hooks/redux';

/**
 * Props interface for AdminRoute component
 */
interface AdminRouteProps {
  children: React.ReactNode;
}

/**
 * AdminRoute Component
 * 
 * Protects routes from non-admin access
 * Redirects to login page if user is not authenticated or not an admin
 * 
 * @param props.children - Components to render if user is admin
 * @returns Protected admin route or redirect to login
 */
const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { user, isAuthenticated } = useAppSelector(state => state.auth);

  if (!isAuthenticated || user?.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default AdminRoute; 