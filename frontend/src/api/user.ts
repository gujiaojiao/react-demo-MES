import request from './request';

export interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  status: number;
  createdAt: string;
}

export interface UserListParams {
  page: number;
  pageSize: number;
  keyword?: string;
}

export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

const userApi = {
  getList: (params: UserListParams) => {
    return request.get<unknown, ApiResponse<{ list: User[]; total: number }>>('/user/list', { params });
  },
  getById: (id: number) => {
    return request.get<unknown, ApiResponse<User>>(`/user/${id}`);
  },
  create: (data: Partial<User>) => {
    return request.post<unknown, ApiResponse<User>>('/user', data);
  },
  update: (id: number, data: Partial<User>) => {
    return request.put<unknown, ApiResponse<User>>(`/user/${id}`, data);
  },
  delete: (id: number) => {
    return request.delete<unknown, ApiResponse<void>>(`/user/${id}`);
  },
};

export default userApi;
