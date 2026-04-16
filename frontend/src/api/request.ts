import axios from 'axios';
import type { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

const request: AxiosInstance = axios.create({
  baseURL: '/api',
  timeout: 15000,
});

// 请求拦截器
request.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
request.interceptors.response.use(
  (response: AxiosResponse): any => {
    const { data } = response;
    // 处理 401 未授权
    if (data.code === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return data;
  },
  (error) => {
    // 处理 HTTP 错误状态
    if (error.response) {
      const { status, data } = error.response;
      if (status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
      // 返回后端的错误响应数据，保持一致的响应结构
      if (data) {
        return Promise.resolve(data);
      }
    }
    return Promise.reject(error);
  }
);

export default request;
