import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 200000,
  withCredentials: true, // Enable sending cookies for CORS requests
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('travecations_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    const message = error.response?.data?.message || error.message || 'Something went wrong';
    
    // Handle unauthorized errors
    if (error.response?.status === 401) {
      localStorage.removeItem('travecations_token');
      localStorage.removeItem('travecations_user');
      window.location.href = '/login';
    }

    return Promise.reject(new Error(message));
  }
);

export default api;
