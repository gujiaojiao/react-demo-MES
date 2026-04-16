import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Layout as AntLayout, Menu, Avatar, Dropdown, Space } from 'antd';
import {
  DashboardOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  ToolOutlined,
  TeamOutlined,
  BookOutlined,
  QuestionOutlined,
  PartitionOutlined,
  ProductOutlined,
  ProfileOutlined,
  ProjectOutlined,
  ShopOutlined,
  RobotOutlined,
  ScheduleOutlined,

} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import useAppStore from '@/store/appStore';

const { Header, Content, Footer } = AntLayout;

const TopLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userInfo, logout, themeColor } = useAppStore();

  const menuItems: MenuProps['items'] = [
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: '控制台',
    },
    {
      // 业务模块（MES）
      key: '/mes',
      icon: <PartitionOutlined />,
      label: '生产管理',
      children: [
        {
          key: '/mes/production',
          icon: <ProductOutlined />,
          label: '产品管理',
        },
        {
          key: '/mes/material',
          icon: <ProfileOutlined />,
          label: '物料管理',
        },
        {
          key: '/mes/bom',
          icon: <ToolOutlined />,
          label: 'BOM管理',
        },
        {
          key: '/mes/process',
          icon: <ProjectOutlined />,
          label: '工序管理',
        },
        {
          key: '/mes/route',
          icon: <ShopOutlined />,
          label: '工艺路线管理',
        },
        {
          key: '/mes/device',
          icon: <RobotOutlined />,
          label: '设备管理',
        },
        {
          key: '/mes/production-order',
          icon: <ScheduleOutlined />,
          label: '生产订单管理',
        },

      ],
    },
    {
      key: '/system',
      icon: <SettingOutlined />,
      label: '系统管理',
      children: [
        {
          key: '/system/user',
          icon: <UserOutlined />,
          label: '用户管理',
        },
        {
          key: '/system/role',
          icon: <TeamOutlined />,
          label: '角色管理',
        },
        {
          key: '/system/dict',
          icon: <BookOutlined />,
          label: '数据字典',
        },
        {
          key: '/system/config',
          icon: <ToolOutlined />,
          label: '系统配置',
        },
      ],
    },
  ];

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人中心',
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      onClick: () => {
        logout();
        localStorage.removeItem('token');
        navigate('/login');
      },
    },
  ];

  const getSelectedKeys = () => {
    const path = location.pathname;
    if (path.startsWith('/system/user')) return ['/system/user'];
    if (path.startsWith('/system/role')) return ['/system/role'];
    if (path.startsWith('/system/dict')) return ['/system/dict'];
    if (path.startsWith('/system/config')) return ['/system/config'];
    return [path];
  };

  return (
    <AntLayout style={{ minHeight: '100vh' }}>
      <Header style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: themeColor,
        padding: '0 24px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <h1 style={{
            color: '#fff',
            fontSize: 20,
            margin: 0,
            marginRight: 40,
            whiteSpace: 'nowrap',
          }}>
            后台管理系统
          </h1>
          <Menu
            theme="dark"
            mode="horizontal"
            selectedKeys={getSelectedKeys()}
            items={menuItems}
            onClick={({ key }) => navigate(key)}
            style={{
              flex: 1,
              minWidth: 200,
              background: 'transparent',
            }}
          />
        </div>
        <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
          <Space style={{ cursor: 'pointer' }}>
            <Avatar icon={<UserOutlined />} src={userInfo?.avatar} />
            <span style={{ color: '#fff' }}>{userInfo?.username || '管理员'}</span>
          </Space>
        </Dropdown>
      </Header>
      <Content style={{ padding: '24px 50px' }}>
        <div style={{
          padding: 24,
          background: '#fff',
          borderRadius: 4,
          minHeight: 280,
        }}>
          <Outlet />
        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>
        后台管理系统 ©{new Date().getFullYear()} Created by Admin
      </Footer>
    </AntLayout>
  );
};

export default TopLayout;