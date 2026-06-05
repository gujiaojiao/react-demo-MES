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

export interface ProductionOrder {
  id: number;
  orderNo: string;
  productId: number;
  productName: string;
  productCode: string;
  routeId: number;
  routeName: string;
  routeCode: string;
  quantity: number;
  status: number;
  planStartDate?: string;
  planEndDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductionOrderListParams {
  page: number;
  pageSize: number;
  keyword?: string;
  status?: number;
}

export interface ProductionOrderPayload {
  orderNo?: string;
  productId: number;
  routeId: number;
  quantity: number;
  planStartDate?: string;
  planEndDate?: string;
}

const orderApi = {
  getList: (params: ProductionOrderListParams) =>
    request.get<unknown, ApiResponse<PageResult<ProductionOrder>>>('/order/list', { params }),
  getById: (id: number) => request.get<unknown, ApiResponse<ProductionOrder>>(`/order/${id}`),
  create: (data: ProductionOrderPayload) =>
    request.post<unknown, ApiResponse<ProductionOrder>>('/order', data),
  update: (id: number, data: ProductionOrderPayload) =>
    request.put<unknown, ApiResponse<ProductionOrder>>(`/order/${id}`, data),
  delete: (id: number) => request.delete<unknown, ApiResponse<void>>(`/order/${id}`),
  start: (id: number) => request.put<unknown, ApiResponse<ProductionOrder>>(`/order/${id}/start`),
  complete: (id: number) =>
    request.put<unknown, ApiResponse<ProductionOrder>>(`/order/${id}/complete`),
  cancel: (id: number) => request.put<unknown, ApiResponse<ProductionOrder>>(`/order/${id}/cancel`),
};

export default orderApi;
