import React, { useEffect, useState } from 'react';
import {
  Button,
  Card,
  Form,
  Input,
  Modal,
  Popconfirm,
  Select,
  Space,
  Table,
  Tag,
  message,
} from 'antd';
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import processApi from '@/api/mes/process';
import type { ProcessItem, ProcessListParams } from '@/api/mes/process';
import '../product/index.css';

const ProcessManage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState<ProcessItem[]>([]);
  const [total, setTotal] = useState(0);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [formData, setFormData] = useState<Partial<ProcessItem>>({});
  const [form] = Form.useForm();

  const fetchData = async () => {
    setLoading(true);
    try {
      const params: ProcessListParams = {
        page: pagination.current,
        pageSize: pagination.pageSize,
        keyword: searchKeyword || undefined,
      };
      const response = await processApi.getList(params);
      if (response.code === 200) {
        setDataSource(response.data?.list || []);
        setTotal(response.data?.total || 0);
      } else {
        message.error(response.message || '获取工序列表失败');
      }
    } catch {
      message.error('获取工序列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [pagination.current, pagination.pageSize]);

  const handleSearch = () => {
    setPagination((prev) => ({ ...prev, current: 1 }));
    fetchData();
  };

  const handleAdd = () => {
    setFormData({});
    form.resetFields();
    form.setFieldsValue({ status: 1 });
    setModalVisible(true);
  };

  const handleEdit = (record: ProcessItem) => {
    setFormData(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await processApi.delete(id);
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
        const response = await processApi.update(formData.id, values);
        if (response.code === 200) {
          message.success('更新成功');
          setModalVisible(false);
          form.resetFields();
          fetchData();
        } else {
          message.error(response.message || '更新失败');
        }
      } else {
        const response = await processApi.create(values);
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

  const columns: ColumnsType<ProcessItem> = [
    { title: 'ID', dataIndex: 'id', width: 80, align: 'center' },
    { title: '工序名称', dataIndex: 'name', width: 180 },
    { title: '工序编码', dataIndex: 'code', width: 160 },
    { title: '工序描述', dataIndex: 'description', ellipsis: true },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      align: 'center',
      render: (status: number) => (
        <Tag color={status === 1 ? 'green' : 'default'}>
          {status === 1 ? '启用' : '禁用'}
        </Tag>
      ),
    },
    { title: '创建时间', dataIndex: 'createdAt', width: 180 },
    {
      title: '操作',
      key: 'action',
      width: 180,
      align: 'center',
      render: (_, record) => (
        <Space size="small">
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
            编辑
          </Button>
          <Popconfirm
            title="确定删除该工序吗？"
            okText="确定"
            cancelText="取消"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button type="link" size="small" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="product-manage">
      <div className="topContent">
        <h2 className="page-title">工序管理</h2>
        <Space size="middle">
          <Input.Search
            placeholder="搜索工序名称或编码"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            onSearch={handleSearch}
            style={{ width: 250 }}
            enterButton={<SearchOutlined />}
            allowClear
          />
          <Button icon={<ReloadOutlined />} onClick={fetchData}>
            刷新
          </Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            新增工序
          </Button>
        </Space>
      </div>

      <Card className="table-card">
        <Table
          columns={columns}
          dataSource={dataSource}
          loading={loading}
          rowKey="id"
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total,
            showSizeChanger: true,
            showQuickJumper: true,
            pageSizeOptions: ['10', '20', '50'],
            showTotal: (value) => `共 ${value} 条记录`,
          }}
          onChange={(pag) =>
            setPagination({
              current: pag.current || 1,
              pageSize: pag.pageSize || 10,
            })
          }
          scroll={{ x: 1100 }}
          size="middle"
        />
      </Card>

      <Modal
        title={formData.id ? '编辑工序' : '新增工序'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
        }}
        destroyOnClose
        width={600}
        okText="保存"
        cancelText="取消"
      >
        <Form form={form} layout="vertical" initialValues={{ status: 1 }}>
          <Form.Item
            name="name"
            label="工序名称"
            rules={[{ required: true, message: '请输入工序名称' }]}
          >
            <Input placeholder="请输入工序名称" maxLength={50} />
          </Form.Item>
          <Form.Item
            name="code"
            label="工序编码"
            rules={[
              { required: true, message: '请输入工序编码' },
              { pattern: /^[A-Za-z0-9_-]+$/, message: '编码只能包含字母、数字、下划线和中划线' },
            ]}
          >
            <Input placeholder="请输入工序编码" maxLength={30} />
          </Form.Item>
          <Form.Item name="description" label="工序描述">
            <Input.TextArea placeholder="请输入工序描述" rows={4} maxLength={200} showCount />
          </Form.Item>
          <Form.Item
            name="status"
            label="状态"
            rules={[{ required: true, message: '请选择状态' }]}
          >
            <Select
              placeholder="请选择状态"
              options={[
                { label: '启用', value: 1 },
                { label: '禁用', value: 0 },
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProcessManage;
