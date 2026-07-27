import axios, { InternalAxiosRequestConfig } from 'axios';

const api = axios.create({
  baseURL: '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refresh_token') || sessionStorage.getItem('refresh_token');
        if (!refreshToken) {
          throw new Error('No refresh token');
        }
        const res = await axios.post('/api/v1/auth/token/refresh/', {
          refresh: refreshToken,
        });

        const newAccessToken = res.data.access;
        if (localStorage.getItem('refresh_token')) {
          localStorage.setItem('access_token', newAccessToken);
        } else {
          sessionStorage.setItem('access_token', newAccessToken);
        }

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (err) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        sessionStorage.removeItem('access_token');
        sessionStorage.removeItem('refresh_token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
