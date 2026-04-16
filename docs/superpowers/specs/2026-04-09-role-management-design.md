---
name: 角色管理模块设计
description: React初学者练手的完整CRUD模块，包含前后端分离实现
type: project
---

# 角色管理模块设计

> 创建时间：2026-04-09
> 用途：React初学者练手项目，基于现有后台管理系统扩展

## 背景

用户有2年Vue开发经验，正在学习React。希望通过实现一个完整的CRUD模块来学习：
- React组件与状态管理
- Ant Design表单与交互
- 数据展示与列表渲染
- 前后端API通信

## 模块概述

角色管理模块，提供角色的增删改查功能，是用户管理模块的姊妹模块，难度适中，适合作为React练手项目。

## 数据模型

```typescript
interface Role {
  id: number;           // 主键
  name: string;         // 角色名称（如"管理员"、"普通用户"）
  code: string;         // 角色编码（如"admin"、"user"，用于代码引用）
  status: number;       // 状态：1-启用，0-禁用
  description?: string; // 角色描述（可选）
  createdAt: string;    // 创建时间
}
```

## 后端API设计

| 接口 | 方法 | 说明 | 请求参数 |
|------|------|------|----------|
| `/api/role/list` | GET | 角色列表（分页） | page, pageSize, keyword |
| `/api/role/:id` | GET | 获取单个角色详情 | id（路径参数） |
| `/api/role` | POST | 创建角色 | Role对象（body） |
| `/api/role/:id` | PUT | 更新角色 | id（路径参数），Role对象（body） |
| `/api/role/:id` | DELETE | 删除角色 | id（路径参数） |

**响应格式（复用现有Result结构）：**
```json
{
  "code": 200,
  "message": "操作成功",
  "data": { ... }
}
```

## 前端功能设计

### 页面组件：`frontend/src/pages/Role/index.tsx`

#### 功能列表

1. **角色列表展示**
   - Ant Design Table组件
   - 分页：支持页码切换、每页条数选择
   - 列定义：ID、角色名称、角色编码、状态、创建时间、操作

2. **搜索筛选**
   - Input.Search 搜索框（搜索角色名称或编码）
   - 刷新按钮

3. **新增角色**
   - Button触发打开Modal
   - Modal内Form表单
   - 表单字段：角色名称（必填）、角色编码（必填）、状态（默认启用）、描述（可选）
   - 提交后刷新列表

4. **编辑角色**
   - 点击编辑按钮，打开Modal
   - Form回填当前角色数据
   - 提交后刷新列表

5. **删除角色**
   - Popconfirm确认框
   - 确认后调用删除API
   - 删除成功后刷新列表

#### 状态管理

```typescript
// 组件内部状态（useState）
const [loading, setLoading] = useState(false);      // 加载状态
const [dataSource, setDataSource] = useState([]);   // 列表数据
const [total, setTotal] = useState(0);              // 总条数
const [pagination, setPagination] = useState({      // 分页配置
  current: 1,
  pageSize: 10
});
const [modalVisible, setModalVisible] = useState(false);  // 弹窗显示
const [formData, setFormData] = useState({});              // 编辑时的表单数据
const [searchKeyword, setSearchKeyword] = useState('');    // 搜索关键词
```

### API层：`frontend/src/api/role.ts`

复用现有 `api/request.ts` 的axios实例，封装角色相关API。

```typescript
interface RoleListParams {
  page: number;
  pageSize: number;
  keyword?: string;
}

const roleApi = {
  getList: (params: RoleListParams) => request.get('/role/list', { params }),
  getById: (id: number) => request.get(`/role/${id}`),
  create: (data: Partial<Role>) => request.post('/role', data),
  update: (id: number, data: Partial<Role>) => request.put(`/role/${id}`, data),
  delete: (id: number) => request.delete(`/role/${id}`),
};
```

### 路由配置

在 `frontend/src/router/index.tsx` 中添加角色管理路由：
- 路径：`/system/role`
- 组件：RoleList
- 菜单名称：角色管理

## 后端实现要点

### 新增文件

- `backend/src/main/java/com/example/admin/entity/Role.java` — Role实体类
- `backend/src/main/java/com/example/admin/dto/RoleDTO.java` — Role DTO
- `backend/src/main/java/com/example/admin/mapper/RoleMapper.java` — MyBatis Mapper
- `backend/src/main/java/com/example/admin/service/RoleService.java` — Service接口
- `backend/src/main/java/com/example/admin/service/impl/RoleServiceImpl.java` — Service实现
- `backend/src/main/java/com/example/admin/controller/RoleController.java` — Controller

### 复用现有组件

- `Result.java` — 统一响应格式
- `PageResult.java` — 分页响应格式
- `JwtFilter` / `SecurityConfig` — JWT认证（已有）
- `GlobalExceptionHandler` — 异常处理（已有）

### 数据库表

```sql
CREATE TABLE role (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(50) NOT NULL COMMENT '角色名称',
  code VARCHAR(50) NOT NULL COMMENT '角色编码',
  status INT DEFAULT 1 COMMENT '状态：1启用，0禁用',
  description VARCHAR(200) COMMENT '角色描述',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间'
);
```

## 学习目标对照

| 学习目标 | 实现内容 | React知识点 |
|----------|----------|-------------|
| 组件与状态 | useState管理loading、列表、弹窗等状态 | hooks基础、状态驱动渲染 |
| 表单与交互 | Form、Modal、Input、Select、Popconfirm | Ant Design组件库、事件处理、表单验证 |
| 数据展示 | Table、分页、列定义、render函数 | 列表渲染、条件渲染、组件复用 |
| 前后端通信 | axios调用API、useEffect触发请求、错误处理 | 异步操作、生命周期理解、try-catch |

## 参考资源

用户可直接参考现有代码：
- `frontend/src/pages/User/index.tsx` — 用户管理页面（结构相同）
- `frontend/src/api/user.ts` — 用户API封装（格式相同）
- `backend/src/main/java/com/example/admin/controller/UserController.java` — Controller示例

## 实现顺序

1. 后端先完成：Entity → Mapper → Service → Controller → 数据库表
2. 后端API测试通过后，提供API文档给用户
3. 用户实现前端：API封装 → 页面组件 → 路由配置
4. 联调测试

---

**Why:** 用户需要React练手项目，有Vue经验可直接上手完整CRUD模块。
**How to apply:** 先由AI完成后端，再由用户自己实现前端，对比学习React与Vue的差异。