# React 后台管理系统

一个基于 React 19 + TypeScript + Ant Design 的前后端分离后台管理系统。

## 技术栈

### 前端
- React 19
- TypeScript
- Vite
- Ant Design
- React Router 7
- Zustand (状态管理)
- Axios (HTTP 请求)
- ECharts (图表)

### 后端
- Node.js
- Express
- TypeScript
- JWT (认证)

## 项目结构

```
react-demo-AI/
├── frontend/          # 前端项目
│   ├── src/
│   │   ├── api/      # API 接口
│   │   ├── layouts/  # 布局组件
│   │   ├── pages/    # 页面组件
│   │   ├── router/   # 路由配置
│   │   ├── store/    # 状态管理
│   │   ├── utils/    # 工具函数
│   │   └── main.tsx  # 入口文件
│   └── package.json
├── backend/           # 后端项目
│   ├── src/
│   │   ├── routes/   # 路由
│   │   └── index.ts  # 入口文件
│   └── package.json
└── package.json       # 根目录配置
```

## 快速开始

### 安装依赖
```bash
npm run install:all
```

### 启动开发服务器
```bash
npm run dev
```

或分别启动：
```bash
# 前端 (端口 5173)
cd frontend && npm run dev

# 后端 (端口 3000)
cd backend && npm run dev
```

### 构建
```bash
npm run build
```

## 默认账号

- 管理员：admin / admin123
- 普通用户：user / user123

## 功能

- [x] 用户登录/登出
- [x] JWT 认证
- [x] 控制台 Dashboard
- [x] 用户管理（增删改查）
- [x] 响应式布局
- [x] 侧边栏菜单

## License

MIT
