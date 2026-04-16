import React from 'react';
import { Card, Col, Row, Statistic } from 'antd';
import {
  UserOutlined,
  TeamOutlined,
  ShoppingCartOutlined,
  RiseOutlined,
} from '@ant-design/icons';

const Dashboard: React.FC = () => {
  return (
    <div>
      <h2 style={{ marginBottom: 24 }}>控制台</h2>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="用户总数"
              value={1268}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="团队数量"
              value={42}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="订单数量"
              value={8846}
              prefix={<ShoppingCartOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="增长率"
              value={28.5}
              suffix="%"
              prefix={<RiseOutlined />}
              valueStyle={{ color: '#f5222d' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col span={24}>
          <Card title="快捷操作">
            <Row gutter={[16, 16]}>
              <Col span={6}>
                <Card hoverable style={{ textAlign: 'center', cursor: 'pointer' }}>
                  <UserOutlined style={{ fontSize: 32, color: '#1890ff' }} />
                  <p style={{ marginTop: 12 }}>用户管理</p>
                </Card>
              </Col>
              <Col span={6}>
                <Card hoverable style={{ textAlign: 'center', cursor: 'pointer' }}>
                  <TeamOutlined style={{ fontSize: 32, color: '#52c41a' }} />
                  <p style={{ marginTop: 12 }}>角色管理</p>
                </Card>
              </Col>
              <Col span={6}>
                <Card hoverable style={{ textAlign: 'center', cursor: 'pointer' }}>
                  <ShoppingCartOutlined style={{ fontSize: 32, color: '#faad14' }} />
                  <p style={{ marginTop: 12 }}>订单管理</p>
                </Card>
              </Col>
              <Col span={6}>
                <Card hoverable style={{ textAlign: 'center', cursor: 'pointer' }}>
                  <RiseOutlined style={{ fontSize: 32, color: '#f5222d' }} />
                  <p style={{ marginTop: 12 }}>数据统计</p>
                </Card>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
