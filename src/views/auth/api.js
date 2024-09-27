// api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api/',
  withCredentials: true,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    // Check if a new token is returned in the response
    const newToken = response.data.token;
    if (newToken) {
      console.log('New token received, updating local storage.');
      localStorage.setItem('token', newToken);
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        console.log('Attempting to refresh token...');
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await api.post('/refresh-token', { refreshToken });
        const { token } = response.data;
        console.log('Token refresh successful, updating local storage.');
        localStorage.setItem('token', token);
        return api(originalRequest);
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;