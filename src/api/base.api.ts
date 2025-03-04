import axios from 'axios';
import { authInterceptor } from './interceptors/auth.interceptor.ts';
import { errorInterceptor } from './interceptors/error.interceptor.ts';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

export const axiosInstance = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 인터셉터 추가
axiosInstance.interceptors.request.use(authInterceptor);
axiosInstance.interceptors.response.use((response) => response, errorInterceptor);

export default axiosInstance;
