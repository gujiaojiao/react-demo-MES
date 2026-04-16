import request from './request';

export interface Role {
    id: number;
    name: string;// 角色名称（如"管理员"、"普通用户"）
    code: string;// 角色编码（如"admin"、"user"）
    status: number;// 角色状态（如1表示启用，0表示禁用）
    description: string;  // 角色描述
    permissions: string;// 权限列表（逗号分隔）
    createdAt: string;
}
export interface RoleListParams {
    page: number;
    pageSize: number;
    keyword?: string;
}

export interface ApiResponse<T> {
    code: number;
    message: string;
    data: T;
}

const roleApi = {
    getList: (params: RoleListParams) => {
        return request.get<unknown, ApiResponse<{ list: Role[], total: number }>>('/role/list', { params })
    },
    getById: (id: number) => {
        return request.get<unknown, ApiResponse<Role>>(`/role/${id}`);
    },
    create: (data: Partial<Role>) => {
        return request.post<unknown, ApiResponse<Role>>('/role', data)
    },
    update: (id: number, data: Partial<Role>) => {
        return request.put<unknown, ApiResponse<Role>>(`/role/${id}`, data)
    },
    delete: (id: number) => {
        return request.delete<unknown, ApiResponse<Role>>(`/role/${id}`)
    }
}
export default roleApi;
