import axios from 'axios';
import useAuthStore from '../store/useAuthStore';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    // Zustand persist stores state as stringified JSON in localStorage
    const authState = localStorage.getItem('auth-storage');
    if (authState) {
      try {
        const { state } = JSON.parse(authState);
        if (state && state.token) {
          config.headers.Authorization = `Bearer ${state.token}`;
        }
      } catch (err) {
        console.error('Error parsing auth state', err);
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Only logout on 401 if it's NOT an explicit login or register request failure!
      const requestUrl = error.config?.url || '';
      if (!requestUrl.includes('/auth/login') && !requestUrl.includes('/auth/register')) {
        const { logout } = useAuthStore.getState();
        logout();
        if (window.location.pathname.startsWith('/profile') || window.location.pathname.startsWith('/admin') || window.location.pathname.startsWith('/checkout')) {
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
