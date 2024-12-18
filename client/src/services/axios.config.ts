/**
 * Axios Configuration
 * 
 * Configures and exports a customized Axios instance
 * Features:
 * - Base URL configuration
 * - Request/response interceptors
 * - Error handling
 * - Token management
 * - Request timeout
 * - Response transformation
 */

import axios from 'axios';
import { toast } from 'react-toastify';

// Create custom axios instance
const instance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3001/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor
instance.interceptors.request.use(
  (config) => {
    // Add timestamp to prevent caching
    config.params = {
      ...config.params,
      _t: Date.now()
    };

    // Log request details in development
    if (process.env.NODE_ENV === 'development') {
      console.log('🚀 Request:', {
        method: config.method?.toUpperCase(),
        url: config.url,
        data: config.data,
        headers: config.headers
      });
    }

    return config;
  },
  (error) => {
    // Log request errors
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
instance.interceptors.response.use(
  (response) => {
    // Log response in development
    if (process.env.NODE_ENV === 'development') {
      console.log('✅ Response:', {
        status: response.status,
        data: response.data,
        headers: response.headers
      });
    }

    return response;
  },
  (error) => {
    // Handle response errors
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;

      switch (status) {
        case 401:
          // Unauthorized - clear auth state
          toast.error('התחברות נדרשת');
          // Trigger logout action here if needed
          break;

        case 403:
          // Forbidden
          toast.error('אין לך הרשאה לבצע פעולה זו');
          break;

        case 404:
          // Not found
          toast.error('המשאב המבוקש לא נמצא');
          break;

        case 422:
          // Validation error
          const validationErrors = data.errors;
          if (validationErrors) {
            Object.values(validationErrors).forEach((error: any) => {
              toast.error(error as string);
            });
          } else {
            toast.error('שגיאה בנתונים שהוזנו');
          }
          break;

        case 500:
          // Server error
          toast.error('שגיאת שרת - נסה שוב מאוחר יותר');
          break;

        default:
          // Other errors
          toast.error('שגיאה לא צפויה - נסה שוב');
      }
    } else if (error.request) {
      // Request made but no response
      toast.error('לא ניתן להתחבר לשרת - בדוק את החיבור לאינטרנט');
    } else {
      // Request setup error
      toast.error('שגיאה בהגדרת הבקשה');
    }

    // Log error details in development
    if (process.env.NODE_ENV === 'development') {
      console.error('❌ Response Error:', error);
    }

    return Promise.reject(error);
  }
);

export default instance; 