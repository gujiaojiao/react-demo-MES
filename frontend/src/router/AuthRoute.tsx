import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAppStore from '@/store/appStore';

interface AuthRouteProps {
  children: React.ReactElement;
}

const AuthRoute: React.FC<AuthRouteProps> = ({ children }) => {
  const location = useLocation();
  const token = useAppStore((state) => state.token);

  if (!token) {
    const from = `${location.pathname}${location.search}${location.hash}`;
    return <Navigate to="/login" state={{ from }} replace />;
  }

  return children;
};

export default AuthRoute;
