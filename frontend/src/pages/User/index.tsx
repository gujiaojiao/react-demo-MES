import React, { useState, useEffect, useCallback } from 'react';
import { Table, Button, Space, Modal, Form, Input, Select, message, Popconfirm, Card } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import userApi from '@/api/user';
import type { User, UserListParams } from '@/api/user';

const UserList: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [formData, setFormData] = useState<Partial<User>>({});
  const [form] = Form.useForm();
  const [searchKeyword, setSearchKeyword] = useState('');

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params: UserListParams = {
        page: pagination.current,
        pageSize: pagination.pageSize,
        keyword: searchKeyword || undefined,
      };
      const response = await userApi.getList(params);
      if (response.code === 200) {
        setDataSource(response.data?.list || []);
        setTotal(response.data?.total || 0);
      } else {
        message.error(response.message || '获取用户列表失败');
        setDataSource([]);
        setTotal(0);
      }
    } catch (error: any) {
      message.error(error?.response?.data?.message || '获取用户列表失败');
      setDataSource([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [pagination.current, pagination.pageSize, searchKeyword]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAdd = () => {
    setFormData({});
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record: User) => {
    setFormData(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await userApi.delete(id);
      if (response.code === 200) {
        message.success('删除成功');
        fetchData();
      } else {
        message.error(response.message || '删除失败');
      }
    } catch (error: any) {
      message.error(error?.response?.data?.message || '删除失败');
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (formData.id) {
        const response = await userApi.update(formData.id, values);
        if (response.code === 200) {
          message.success('更新成功');
          setModalVisible(false);
          form.resetFields();
          fetchData();
        } else {
          message.error(response.message || '更新失败');
        }
      } else {
        const response = await userApi.create(values);
        if (response.code === 200) {
          message.success('创建成功');
          setModalVisible(false);
          form.resetFields();
          fetchData();
        } else {
          message.error(response.message || '创建失败');
        }
      }
    } catch (error: any) {
      const errorMsg = error?.response?.data?.message || error?.message || '保存失败';
      message.error(errorMsg);
    }
  };

  const handleTableChange = (pag: any) => {
    setPagination({
      current: pag.current,
      pageSize: pag.pageSize,
    });
  };

  const handleSearch = () => {
    setPagination({ ...pagination, current: 1 });
  };

  const columns: ColumnsType<User> = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 80,
    },
    {
      title: '用户名',
      dataIndex: 'username',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
    },
    {
      title: '角色',
      dataIndex: 'role',
      render: (role) => (
        <span style={{
          color: role === 'admin' ? '#f5222d' : '#1890ff'
        }}>
          {role === 'admin' ? '管理员' : '普通用户'}
        </span>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: (status) => (
        <span style={{ color: status === 1 ? '#52c41a' : '#999' }}>
          {status === 1 ? '启用' : '禁用'}
        </span>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      width: 180,
    },
    {
      title: '操作',
      key: 'action',
      width: 180,
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定删除该用户吗？"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0 }}>用户管理</h2>
        <Space>
          <Input.Search
            placeholder="搜索用户名或邮箱"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            onSearch={handleSearch}
            style={{ width: 250 }}
            enterButton={<SearchOutlined />}
          />
          <Button icon={<ReloadOutlined />} onClick={fetchData}>
            刷新
          </Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            新增用户
          </Button>
        </Space>
      </div>

      <Card bordered={false}>
        <Table
          columns={columns}
          dataSource={dataSource}
          loading={loading}
          rowKey="id"
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: total,
            showSizeChanger: true,
            showQuickJumper: true,
            pageSizeOptions: ['10', '20', '50'],
            showTotal: (total) => `共 ${total} 条`,
          }}
          onChange={handleTableChange}
        />
      </Card>

      <Modal
        title={formData.id ? '编辑用户' : '新增用户'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
        }}
        destroyOnClose
      >
        <Form form={form} layout="vertical" initialValues={{ role: 'user', status: 1 }}>
          <Form.Item name="username" label="用户名" rules={[{ required: true, message: '请输入用户名' }]}>
            <Input placeholder="请输入用户名" />
          </Form.Item>
          <Form.Item name="email" label="邮箱" rules={[{ required: true, type: 'email', message: '请输入正确的邮箱' }]}>
            <Input placeholder="请输入邮箱" />
          </Form.Item>
          <Form.Item name="role" label="角色" rules={[{ required: true, message: '请选择角色' }]}>
            <Select>
              <Select.Option value="admin">管理员</Select.Option>
              <Select.Option value="user">普通用户</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="status" label="状态" rules={[{ required: true, message: '请选择状态' }]}>
            <Select>
              <Select.Option value={1}>启用</Select.Option>
              <Select.Option value={0}>禁用</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserList;