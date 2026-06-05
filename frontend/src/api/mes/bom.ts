import request from '@/api/request';

export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

export interface BomItem {
  id: number;
  productId: number;
  materialId: number;
  materialName: string;
  materialCode: string;
  materialType: string;
  unit: string;
  quantity: number;
  createdAt: string;
}

export interface BomPayload {
  productId: number;
  materialId: number;
  quantity: number;
}

const bomApi = {
  getListByProductId: (productId: number) =>
    request.get<unknown, ApiResponse<BomItem[]>>('/bom/list', { params: { productId } }),
  getById: (id: number) => request.get<unknown, ApiResponse<BomItem>>(`/bom/${id}`),
  create: (data: BomPayload) => request.post<unknown, ApiResponse<BomItem>>('/bom', data),
  update: (id: number, data: Partial<BomPayload>) =>
    request.put<unknown, ApiResponse<BomItem>>(`/bom/${id}`, data),
  delete: (id: number) => request.delete<unknown, ApiResponse<void>>(`/bom/${id}`),
};

export default bomApi;
