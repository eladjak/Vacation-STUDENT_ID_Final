/**
 * Main Application Component
 * 
 * Root component that handles routing and layout
 * Features:
 * - Protected routes
 * - Authentication check
 * - Responsive layout
 * - Navigation
 * - Toast notifications
 */

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { useSelector } from 'react-redux';
import { Box } from '@mui/material';
import { RootState } from './store';

// Layout components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Sidebar from './components/layout/Sidebar';

// Page components
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import VacationList from './components/vacations/VacationList';
import VacationForm from './components/vacations/VacationForm';
import VacationStats from './components/admin/VacationStats';
import NotFound from './components/common/NotFound';

// Styles
import 'react-toastify/dist/ReactToastify.css';
import { mainContentStyle, containerStyle } from './styles/layout';

// Protected route wrapper
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

// Admin route wrapper
const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  return isAuthenticated && user?.role === 'admin' ? 
    <>{children}</> : 
    <Navigate to="/" />;
};

const App: React.FC = () => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  return (
    <BrowserRouter>
      <Box sx={containerStyle}>
        {/* Global notification container */}
        <ToastContainer
          position="top-right"
          autoClose={5000}
          rtl
          theme="colored"
        />
        
        {/* Main layout */}
        {isAuthenticated && <Header />}
        {isAuthenticated && <Sidebar />}
        
        {/* Main content area */}
        <Box component="main" sx={mainContentStyle}>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected routes */}
            <Route path="/" element={
              <ProtectedRoute>
                <VacationList />
              </ProtectedRoute>
            } />
            
            {/* Admin routes */}
            <Route path="/vacation/new" element={
              <AdminRoute>
                <VacationForm />
              </AdminRoute>
            } />
            <Route path="/vacation/edit/:id" element={
              <AdminRoute>
                <VacationForm />
              </AdminRoute>
            } />
            <Route path="/stats" element={
              <AdminRoute>
                <VacationStats />
              </AdminRoute>
            } />
            
            {/* 404 route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Box>
        
        {isAuthenticated && <Footer />}
      </Box>
    </BrowserRouter>
  );
};

export default App; 