import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 20000
});

// Attach the JWT to every admin request.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('nisha_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Bounce to the sign in screen when a session expires.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const onAdminRoute = window.location.pathname.startsWith('/admin') || window.location.pathname.startsWith('/super-admin');
    if (status === 401 && onAdminRoute && !window.location.pathname.includes('/login')) {
      localStorage.removeItem('nisha_token');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

export const readError = (error, fallback = 'Something went wrong. Please try again.') =>
  error?.response?.data?.message || error?.message || fallback;

export default api;
