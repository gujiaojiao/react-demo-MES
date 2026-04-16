import request from '@/api/request'

export interface Product {
    id: number;
    name: string;// 产品名称
    code: string;// 产品编码
    spec: string;// 产品规格
    status: number;// 产品状态（如1表示启用，0表示禁用）
    description: string;  // 产品描述
    createdAt: string;
    updatedAt: string;
}

export interface ProductListParams {
    page: number;
    pageSize: number;
    keyword?: string;
}

export interface PageResult<T> {
    list: T[];
    total: number;
}

export interface ApiResponse<T> {
    code: number;
    message: string;
    data: T;
}
const productApi = {
    getList: (params: ProductListParams) => {
        return request.get<unknown, ApiResponse<PageResult<Product>>>('/product/list', { params })
    },
    getById: (id: number) => {
        return request.get<unknown, ApiResponse<Product>>(`/product/${id}`)
    },
    create: (data: Partial<Product>) => {
        return request.post<unknown, ApiResponse<Product>>('/product', data)
    },
    delete: (id: number) => {
        return request.delete<unknown, ApiResponse<Product>>(`/product/${id}`)
    },
    update: (id: number, data: Partial<Product>) => {
        return request.put<unknown, ApiResponse<Product>>(`/product/${id}`, data)
    },

}
export default productApi;
