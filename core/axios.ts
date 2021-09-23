import axios from 'axios';

const Axios = axios.create({
  baseURL: 'http://localhost:3001/',
});

Axios.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    config.headers.Authorization = window.localStorage.getItem('token');
  }

  return config;
});

export { Axios };
