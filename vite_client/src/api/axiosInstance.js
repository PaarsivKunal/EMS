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

export default axiosInstance;
