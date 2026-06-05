import request from '@/api/request';

export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

export interface PageResult<T> {
  list: T[];
  total: number;
}

export interface Material {
  id: number;
  name: string;
  code: string;
  type: string;
  stockQty: number;
  unit: string;
  status: number;
  createdAt: string;
  updatedAt: string;
}

export interface MaterialListParams {
  page: number;
  pageSize: number;
  keyword?: string;
  type?: string;
}

const materialApi = {
  getList: (params: MaterialListParams) =>
    request.get<unknown, ApiResponse<PageResult<Material>>>('/material/list', { params }),
  getById: (id: number) => request.get<unknown, ApiResponse<Material>>(`/material/${id}`),
  create: (data: Partial<Material>) =>
    request.post<unknown, ApiResponse<Material>>('/material', data),
  update: (id: number, data: Partial<Material>) =>
    request.put<unknown, ApiResponse<Material>>(`/material/${id}`, data),
  delete: (id: number) => request.delete<unknown, ApiResponse<void>>(`/material/${id}`),
};

export default materialApi;
