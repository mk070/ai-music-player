import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  // Don't set default Content-Type here - it will be set automatically
  withCredentials: true,
  // Important: Don't transform FormData
  transformRequest: [
    (data, headers) => {
      // If data is FormData, don't transform it
      if (data instanceof FormData) {
        // Remove any existing Content-Type to let the browser set it with the correct boundary
        delete headers['Content-Type'];
        return data;
      }
      // For non-FormData, use default JSON transformation
      if (data && typeof data === 'object') {
        headers['Content-Type'] = 'application/json';
        return JSON.stringify(data);
      }
      return data;
    }
  ]
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log request details for debugging
    if (process.env.NODE_ENV === 'development') {
      console.log('=== Request Config ===');
      console.log('URL:', config.url);
      console.log('Method:', config.method);
      console.log('Headers:', config.headers);
      
      if (config.data instanceof FormData) {
        console.log('Body: FormData with entries:');
        for (let pair of config.data.entries()) {
          console.log(pair[0], pair[1]);
        }
      } else {
        console.log('Body:', config.data);
      }
    }
    
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
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
