import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3001',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: true
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('Request:', { 
      url: config.url, 
      method: config.method, 
      data: config.data,
      headers: config.headers
    });
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
    console.log('Response:', { 
      url: response.config.url, 
      status: response.status, 
      data: response.data,
      headers: response.headers
    });
    return response;
  },
  (error) => {
    console.error('Response error:', error);
    
    // Handle network errors
    if (!error.response) {
      console.error('Network error:', error.message);
      return Promise.reject(new Error('שגיאת רשת. אנא בדוק את החיבור שלך.'));
    }

    // Handle 401 Unauthorized
    if (error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
      return Promise.reject(new Error('שם משתמש או סיסמה שגויים'));
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