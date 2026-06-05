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

export interface RouteProcessItem {
  processId: number;
  processName: string;
  processCode: string;
  sequence: number;
}

export interface RouteItem {
  id: number;
  name: string;
  code: string;
  description: string;
  status: number;
  createdAt: string;
  updatedAt: string;
}

export interface RouteDetail extends RouteItem {
  processes: RouteProcessItem[];
}

export interface RoutePayload {
  name: string;
  code: string;
  description?: string;
  status: number;
  processes?: Array<{
    processId: number;
    sequence: number;
  }>;
}

export interface RouteListParams {
  page: number;
  pageSize: number;
  keyword?: string;
}

const routeApi = {
  getList: (params: RouteListParams) =>
    request.get<unknown, ApiResponse<PageResult<RouteItem>>>('/route/list', { params }),
  getById: (id: number) => request.get<unknown, ApiResponse<RouteItem>>(`/route/${id}`),
  getWithProcesses: (id: number) =>
    request.get<unknown, ApiResponse<RouteDetail>>(`/route/${id}/with-processes`),
  create: (data: RoutePayload) => request.post<unknown, ApiResponse<RouteItem>>('/route', data),
  update: (id: number, data: RoutePayload) =>
    request.put<unknown, ApiResponse<RouteItem>>(`/route/${id}`, data),
  delete: (id: number) => request.delete<unknown, ApiResponse<void>>(`/route/${id}`),
};

export default routeApi;
