import React, { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Form, Input, Button, Card, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { authApi } from '@/api';
import useAppStore from '@/store/appStore';

interface LoginForm {
  username: string;
  password: string;
}

interface LoginLocationState {
  from?: string;
}

const DEFAULT_AFTER_LOGIN = '/dashboard';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { token, setToken, setUserInfo } = useAppStore();
  const [loading, setLoading] = useState(false);

  const from = (location.state as LoginLocationState | null)?.from || DEFAULT_AFTER_LOGIN;

  if (token) {
    return <Navigate to={from} replace />;
  }

  const onFinish = async (values: LoginForm) => {
    setLoading(true);
    try {
      const res = await authApi.login(values);
      setToken(res.token);
      setUserInfo(res.userInfo);
      message.success('登录成功');
      navigate(from, { replace: true });
    } catch (error: any) {
      message.error(error.response?.data?.message || '登录失败，请检查用户名和密码');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    }}
    >
      <Card style={{ width: 400, boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}>
        <div style={{ textAlign: 'center', marginBottom: 30 }}>
          <h1 style={{ fontSize: 24, margin: 0, color: '#333' }}>后台管理系统</h1>
          <p style={{ color: '#999', marginTop: 8 }}>欢迎登录</p>
        </div>
        <Form onFinish={onFinish} size="large">
          <Form.Item
            name="username"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="用户名" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="密码" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              登录
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
