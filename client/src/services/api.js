import axios from 'axios';

// Axios instance with base URL pointing to backend API
const API = axios.create({
  baseURL: '/api',
});

// Request interceptor to attach JWT token if present in localStorage
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

export default API;
