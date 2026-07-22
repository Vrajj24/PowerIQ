import axios from 'axios';

// Use environment variable if provided, otherwise default to the Render production URL
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://poweriq.onrender.com';

// Create an Axios instance
const api = axios.create({
  baseURL: `${BACKEND_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to attach the JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('poweriq_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      // Clear token and force reload to kick user to login page
      localStorage.removeItem('poweriq_token');
      localStorage.removeItem('poweriq_user');
      window.dispatchEvent(new Event('auth-expired'));
      // Only reload if we aren't already on the login page to prevent loops
      if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
