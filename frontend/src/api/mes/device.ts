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

export interface Device {
  id: number;
  name: string;
  code: string;
  type: string;
  location: string;
  status: number;
  createdAt: string;
  updatedAt: string;
}

export interface DeviceListParams {
  page: number;
  pageSize: number;
  keyword?: string;
  type?: string;
}

const deviceApi = {
  getList: (params: DeviceListParams) =>
    request.get<unknown, ApiResponse<PageResult<Device>>>('/device/list', { params }),
  getById: (id: number) => request.get<unknown, ApiResponse<Device>>(`/device/${id}`),
  create: (data: Partial<Device>) => request.post<unknown, ApiResponse<Device>>('/device', data),
  update: (id: number, data: Partial<Device>) =>
    request.put<unknown, ApiResponse<Device>>(`/device/${id}`, data),
  delete: (id: number) => request.delete<unknown, ApiResponse<void>>(`/device/${id}`),
};

export default deviceApi;
