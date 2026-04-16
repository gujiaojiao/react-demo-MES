import request from './request';

export interface LoginParams {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  userInfo: {
    id: number;
    username: string;
    role: string;
  };
}

export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

const authApi = {
  login: async (data: LoginParams): Promise<LoginResponse> => {
    const res = await request.post<unknown, ApiResponse<LoginResponse>>('/auth/login', data);
    if (res.code === 200 && res.data) {
      return res.data;
    }
    throw new Error(res.message || '登录失败');
  },
  logout: () => {
    return request.post('/auth/logout');
  },
  getInfo: () => {
    return request.get('/auth/info');
  },
};

export default authApi;
