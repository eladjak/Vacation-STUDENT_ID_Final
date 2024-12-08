import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: '/api/v1',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Added token to request:', { 
        url: config.url,
        tokenPrefix: token.substring(0, 20) + '...'
      });
    } else {
      console.log('No token found for request:', config.url);
    }
    
    // Don't add Content-Type for FormData
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(new Error('שגיאה בשליחת הבקשה'));
  }
);

// Add a response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    console.log('Response success:', { 
      url: response.config.url, 
      status: response.status
    });
    return response;
  },
  (error) => {
    console.error('Response error:', {
      url: error.config?.url,
      status: error.response?.status,
      message: error.response?.data?.message
    });
    
    // Handle network errors
    if (!error.response) {
      return Promise.reject(new Error('שגיאת רשת. אנא בדוק את החיבור שלך.'));
    }

    // Handle 401 Unauthorized
    if (error.response.status === 401) {
      const currentPath = window.location.pathname;
      // Only clear token and redirect if we're not already on the login page
      // and not trying to login
      if (currentPath !== '/login' && !error.config.url?.includes('/auth/login')) {
        console.log('Unauthorized access, clearing session...');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
      return Promise.reject(new Error(error.response.data?.message || 'נדרשת התחברות מחדש'));
    }

    // Handle 403 Forbidden
    if (error.response.status === 403) {
      return Promise.reject(new Error('אין לך הרשאות לבצע פעולה זו.'));
    }

    // Handle 404 Not Found
    if (error.response.status === 404) {
      return Promise.reject(new Error('הכתובת המבוקשת לא נמצאה. אנא נסה שוב.'));
    }

    // Handle validation errors
    if (error.response.status === 400) {
      const message = error.response.data?.message || 'נתונים לא תקינים';
      return Promise.reject(new Error(message));
    }

    // Handle server errors
    if (error.response.status >= 500) {
      return Promise.reject(new Error('שגיאת שרת. אנא נסה שוב מאוחר יותר.'));
    }

    // Handle other errors
    const message = error.response?.data?.message || 'שגיאה לא צפויה התרחשה.';
    return Promise.reject(new Error(message));
  }
);

export default axiosInstance; 