import React from 'react';
import { Navigate, Routes, Route } from 'react-router-dom';
import AuthRoute from './AuthRoute';
import Layout from '@/layouts/Layout';
import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';
import UserList from '@/pages/User';
import RoleList from '@/pages/Role';
import DictList from '@/pages/Dict';
import SystemConfig from '@/pages/SystemConfig';
import ProductManage from '@/pages/MESManage/product';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* 登录页 - 不需要鉴权 */}
      <Route path="/login" element={<Login />} />

      {/* 需要鉴权的路由 - 用AuthRoute包裹 */}
      <Route
        path="/"
        element={
          <AuthRoute>
            <Layout />
          </AuthRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="mes">
          <Route path="production" element={<ProductManage />} />
        </Route>
        <Route path="system">
          <Route path="user" element={<UserList />} />
          <Route path="role" element={<RoleList />} />
          <Route path="dict" element={<DictList />} />
          <Route path="config" element={<SystemConfig />} />
        </Route>
      </Route>

      {/* 404跳转 */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default AppRoutes;
