import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
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
  (response) => response,
  (error) => {
    // Handle common errors (401, 403, 500, etc.)
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // Handle unauthorized (token expired, invalid, etc.)
          localStorage.removeItem('token');
          window.location.href = '/login';
          break;
        case 403:
          // Handle forbidden
          console.error('Forbidden: You do not have permission to access this resource');
          break;
        case 500:
          console.error('Server Error: Please try again later');
          break;
        default:
          console.error('An error occurred');
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('Network Error: Please check your internet connection');
    } else {
      // Something happened in setting up the request
      console.error('Request Error:', error.message);
    }
    return Promise.reject(error);
  }
);

// API methods
export const dashboardApi = {
  getTrendingSongs: () => api.get('/dashboard/trending'),
  getTopArtists: () => api.get('/dashboard/top-artists'),
  getRecentFavorites: () => api.get('/dashboard/recent-favorites'),
};

export default api;
