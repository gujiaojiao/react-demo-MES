import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

interface AuthRouteProps {
  children: React.ReactElement;
}

/**
 * 路由鉴权组件 - 类似Vue的router.beforeEach
 * 有token才能访问，否则跳转登录页
 */
const AuthRoute: React.FC<AuthRouteProps> = ({ children }) => {
  const location = useLocation();
  const token = localStorage.getItem('token');

  if (!token) {
    // 保存当前路径，登录后可以跳回来
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return children;
};

export default AuthRoute;