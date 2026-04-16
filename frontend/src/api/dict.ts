import request from './request';

export interface Dict {
    id: number;
    dictType: string;
    dictCode: string;
    dictLabel: string;
    sort: number;
    status: number;
    createdAt: string;
}

export interface DictTypeVO {
    dictType: string;
    itemCount: number;
}

export interface ApiResponse<T> {
    code: number;
    message: string;
    data: T;
}

const dictApi = {
    // 获取所有字典类型
    getTypes: () => {
        return request.get<unknown, ApiResponse<DictTypeVO[]>>('/dict/types');
    },
    // 获取某类型下的字典项
    getByType: (dictType: string) => {
        return request.get<unknown, ApiResponse<Dict[]>>(`/dict/type/${dictType}`);
    },
    getById: (id: number) => {
        return request.get<unknown, ApiResponse<Dict>>(`/dict/${id}`);
    },
    create: (data: Partial<Dict>) => {
        return request.post<unknown, ApiResponse<Dict>>('/dict', data);
    },
    update: (id: number, data: Partial<Dict>) => {
        return request.put<unknown, ApiResponse<Dict>>(`/dict/${id}`, data);
    },
    delete: (id: number) => {
        return request.delete<unknown, ApiResponse<Dict>>(`/dict/${id}`);
    }
};

export default dictApi;