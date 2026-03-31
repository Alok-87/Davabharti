// import axios from 'axios';

// const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL
//   ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1`
//   : 'https://dv-back.thundergits.com/api/v1';

// const api = axios.create({
//   baseURL,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// // dummy interceptor for auth token
// api.interceptors.request.use((config) => {
//   const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// export default api;

import axios from 'axios';
import { getToken, setToken } from '@/features/auth/utils/tokenManager'; // rename tokenstorage.ts to tokenManager.ts

const baseURL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v4`


const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ✅ Automatically attach token
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Handle token expiry / logout globally
// In axios instance - Update response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token invalid or expired
      setToken(null);
      if (typeof window !== 'undefined') {
        // Dispatch custom event instead of redirecting
        window.dispatchEvent(new CustomEvent('auth:login-required', {
          detail: {
            returnUrl: window.location.pathname,
            message: 'Session expired. Please log in again.'
          }
        }));
      }

    }

    // Don't redirect for profile-related 404 errors
    if (error.config?.url?.includes('/customer/me') && error.response?.status === 404) {
      // Let the component handle this gracefully
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

export default api;
