import axios from 'axios';
import type { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import useAppStore from '@/store/appStore';

const request: AxiosInstance = axios.create({
  baseURL: '/api',
  timeout: 15000,
});

request.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = useAppStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

request.interceptors.response.use(
  (response: AxiosResponse): any => {
    const { data } = response;
    if (data.code === 401) {
      useAppStore.getState().logout();
      window.location.href = '/login';
    }
    return data;
  },
  (error) => {
    if (error.response) {
      const { status, data } = error.response;
      if (status === 401) {
        useAppStore.getState().logout();
        window.location.href = '/login';
      }
      if (data) {
        return Promise.resolve(data);
      }
    }
    return Promise.reject(error);
  }
);

export default request;
