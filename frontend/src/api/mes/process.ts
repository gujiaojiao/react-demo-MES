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

export interface ProcessItem {
  id: number;
  name: string;
  code: string;
  description: string;
  status: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProcessListParams {
  page: number;
  pageSize: number;
  keyword?: string;
}

const processApi = {
  getList: (params: ProcessListParams) =>
    request.get<unknown, ApiResponse<PageResult<ProcessItem>>>('/process/list', { params }),
  getById: (id: number) => request.get<unknown, ApiResponse<ProcessItem>>(`/process/${id}`),
  create: (data: Partial<ProcessItem>) =>
    request.post<unknown, ApiResponse<ProcessItem>>('/process', data),
  update: (id: number, data: Partial<ProcessItem>) =>
    request.put<unknown, ApiResponse<ProcessItem>>(`/process/${id}`, data),
  delete: (id: number) => request.delete<unknown, ApiResponse<void>>(`/process/${id}`),
};

export default processApi;
