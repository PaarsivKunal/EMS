import axios from 'axios';

// Use VITE_API_BASE_URL if available (includes /api/v1), otherwise default
// For relative paths to work correctly with /v1/... when baseURL includes /api
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL 
  ? import.meta.env.VITE_API_BASE_URL.replace(/\/v1$/, '') // Remove /v1 if present, we'll add /api
  : (import.meta.env.VITE_API_URL || 'http://localhost:5000/api');

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add CSRF token for state-changing methods
axiosInstance.interceptors.request.use(
  (config) => {
    // Add CSRF header for state-changing requests if token cookie exists
    try {
      const method = (config.method || 'get').toLowerCase();
      if (typeof document !== 'undefined' && ['post', 'put', 'patch', 'delete'].includes(method)) {
        const csrfCookie = document.cookie.split('; ').find(c => c.startsWith('csrfToken='));
        const csrf = csrfCookie ? csrfCookie.split('=')[1] : undefined;
        if (csrf) {
          config.headers = config.headers || {};
          config.headers['x-csrf-token'] = csrf;
        }
      }
    } catch (error) {
      // Silently fail if can't access cookies
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle 401 errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 errors - redirect to login
    if (error.response?.status === 401) {
      // Only redirect if not already on login page
      if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
        console.warn('401 Unauthorized - Redirecting to login');
        // Clear any stored auth data
        if (typeof localStorage !== 'undefined') {
          localStorage.removeItem('role');
          localStorage.removeItem('email');
        }
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
