import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../../hooks/redux';

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { user, isAuthenticated } = useAppSelector(state => state.auth);

  if (!isAuthenticated || user?.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default AdminRoute; 