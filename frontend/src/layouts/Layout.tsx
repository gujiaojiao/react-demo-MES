import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Avatar, Dropdown, Layout as AntLayout, Menu, Space } from 'antd';
import {
  BookOutlined,
  DashboardOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PartitionOutlined,
  ProductOutlined,
  ProfileOutlined,
  RobotOutlined,
  ScheduleOutlined,
  SettingOutlined,
  ShopOutlined,
  TeamOutlined,
  ToolOutlined,
  ProjectOutlined,
  UserOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import useAppStore from '@/store/appStore';
import TopLayout from './TopLayout';

const { Header, Sider, Content } = AntLayout;

const SideLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userInfo, sidebarCollapsed, toggleSidebar, logout, themeColor, sidebarWidth } = useAppStore();

  const menuItems: MenuProps['items'] = [
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: '控制台',
    },
    {
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
        navigate('/login', { replace: true });
      },
    },
  ];

  const getSelectedKeys = () => {
    const path = location.pathname;
    if (path.startsWith('/mes/product/')) return ['/mes/production'];
    if (path.startsWith('/mes/material')) return ['/mes/material'];
    if (path.startsWith('/mes/process')) return ['/mes/process'];
    if (path.startsWith('/mes/route')) return ['/mes/route'];
    if (path.startsWith('/mes/device')) return ['/mes/device'];
    if (path.startsWith('/mes/production-order')) return ['/mes/production-order'];
    if (path.startsWith('/mes/production')) return ['/mes/production'];
    if (path.startsWith('/system/user')) return ['/system/user'];
    if (path.startsWith('/system/role')) return ['/system/role'];
    if (path.startsWith('/system/dict')) return ['/system/dict'];
    if (path.startsWith('/system/config')) return ['/system/config'];
    return [path];
  };

  const getOpenKeys = () => {
    const path = location.pathname;
    if (path.startsWith('/mes/')) return ['/mes'];
    if (path.startsWith('/system/')) return ['/system'];
    return [];
  };

  return (
    <AntLayout style={{ minHeight: '100vh' }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={sidebarCollapsed}
        width={sidebarWidth}
        theme="dark"
      >
        <div
          style={{
            height: 64,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: themeColor,
          }}
        >
          <h1
            style={{
              color: '#fff',
              fontSize: sidebarCollapsed ? 16 : 18,
              margin: 0,
              whiteSpace: 'nowrap',
            }}
          >
            {sidebarCollapsed ? '管理系统' : '后台管理系统'}
          </h1>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={getSelectedKeys()}
          defaultOpenKeys={getOpenKeys()}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
        />
      </Sider>
      <AntLayout>
        <Header
          style={{
            padding: '0 16px',
            background: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
          }}
        >
          <Space>
            {React.createElement(sidebarCollapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
              className: 'trigger',
              onClick: toggleSidebar,
              style: { fontSize: 18, cursor: 'pointer' },
            })}
          </Space>
          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
            <Space style={{ cursor: 'pointer' }}>
              <Avatar icon={<UserOutlined />} src={userInfo?.avatar} />
              <span style={{ color: '#333' }}>{userInfo?.username || '管理员'}</span>
            </Space>
          </Dropdown>
        </Header>
        <Content
          style={{
            margin: 16,
            padding: 24,
            background: '#fff',
            borderRadius: 4,
          }}
        >
          <Outlet />
        </Content>
      </AntLayout>
    </AntLayout>
  );
};

const Layout: React.FC = () => {
  const { layoutMode } = useAppStore();

  if (layoutMode === 'top') {
    return <TopLayout />;
  }

  return <SideLayout />;
};

export default Layout;
