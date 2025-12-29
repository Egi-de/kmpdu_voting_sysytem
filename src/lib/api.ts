import axios from 'axios';

// Use environment variable or default to the provided URL
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://kpdu.onrender.com';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized - maybe clear token content
    if (error.response && error.response.status === 401) {
      // localStorage.removeItem('auth_token');
      // window.location.href = '/login'; // Optional: redirect to login
    }
    return Promise.reject(error);
  }
);

export default api;
