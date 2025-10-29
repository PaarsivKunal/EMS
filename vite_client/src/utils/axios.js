import axios from 'axios';

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true, // Essential for cookies
});

// Request interceptor to add debugging (only in development)
instance.interceptors.request.use(
  (config) => {
    // Only log in development, never log cookies
    if (import.meta.env.DEV) {
      console.log('Making request to:', config.url);
      // Never log cookies or sensitive headers
      const safeHeaders = { ...config.headers };
      if (safeHeaders.Authorization) {
        safeHeaders.Authorization = '[REDACTED]';
      }
      console.log('Request headers:', safeHeaders);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle network errors
    if (error.code === 'ERR_NETWORK') {
      console.error('Network error: Server might not be running');
    }
    
    // Handle 401 errors
    if (error.response?.status === 401) {
      // Only redirect if not already on login page
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export default instance;