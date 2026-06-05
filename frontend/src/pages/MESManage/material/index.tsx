import React, { useEffect, useState } from 'react';
import {
  Button,
  Card,
  Form,
  Input,
  InputNumber,
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
import materialApi from '@/api/mes/material';
import type { Material, MaterialListParams } from '@/api/mes/material';
import '../product/index.css';

const materialTypeOptions = [
  { label: '原料', value: 'raw' },
  { label: '零部件', value: 'part' },
  { label: '包装物', value: 'package' },
];

const MaterialManage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState<Material[]>([]);
  const [total, setTotal] = useState(0);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [filterType, setFilterType] = useState<string | undefined>();
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [formData, setFormData] = useState<Partial<Material>>({});
  const [form] = Form.useForm();

  const fetchData = async () => {
    setLoading(true);
    try {
      const params: MaterialListParams = {
        page: pagination.current,
        pageSize: pagination.pageSize,
        keyword: searchKeyword || undefined,
        type: filterType || undefined,
      };
      const response = await materialApi.getList(params);
      if (response.code === 200) {
        setDataSource(response.data?.list || []);
        setTotal(response.data?.total || 0);
      } else {
        message.error(response.message || '获取物料列表失败');
      }
    } catch {
      message.error('获取物料列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [pagination.current, pagination.pageSize, filterType]);

  const handleSearch = () => {
    setPagination((prev) => ({ ...prev, current: 1 }));
    fetchData();
  };

  const handleAdd = () => {
    setFormData({});
    form.resetFields();
    form.setFieldsValue({ status: 1, stockQty: 0 });
    setModalVisible(true);
  };

  const handleEdit = (record: Material) => {
    setFormData(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await materialApi.delete(id);
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
        const response = await materialApi.update(formData.id, values);
        if (response.code === 200) {
          message.success('更新成功');
          setModalVisible(false);
          form.resetFields();
          fetchData();
        } else {
          message.error(response.message || '更新失败');
        }
      } else {
        const response = await materialApi.create(values);
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

  const columns: ColumnsType<Material> = [
    { title: 'ID', dataIndex: 'id', width: 80, align: 'center' },
    { title: '物料名称', dataIndex: 'name', width: 180 },
    { title: '物料编码', dataIndex: 'code', width: 160 },
    {
      title: '物料类型',
      dataIndex: 'type',
      width: 100,
      render: (value: string) => materialTypeOptions.find((item) => item.value === value)?.label || value,
    },
    { title: '库存数量', dataIndex: 'stockQty', width: 100, align: 'right' },
    { title: '单位', dataIndex: 'unit', width: 100, align: 'center' },
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
            title="确定删除该物料吗？"
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
        <h2 className="page-title">物料管理</h2>
        <Space size="middle" wrap>
          <Input.Search
            placeholder="搜索物料名称或编码"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            onSearch={handleSearch}
            style={{ width: 250 }}
            enterButton={<SearchOutlined />}
            allowClear
          />
          <Select
            placeholder="筛选物料类型"
            allowClear
            style={{ width: 160 }}
            value={filterType}
            options={materialTypeOptions}
            onChange={(value) => {
              setFilterType(value);
              setPagination((prev) => ({ ...prev, current: 1 }));
            }}
          />
          <Button icon={<ReloadOutlined />} onClick={fetchData}>
            刷新
          </Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            新增物料
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
          scroll={{ x: 1200 }}
          size="middle"
        />
      </Card>

      <Modal
        title={formData.id ? '编辑物料' : '新增物料'}
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
        <Form form={form} layout="vertical" initialValues={{ status: 1, stockQty: 0 }}>
          <Form.Item
            name="name"
            label="物料名称"
            rules={[{ required: true, message: '请输入物料名称' }]}
          >
            <Input placeholder="请输入物料名称" maxLength={50} />
          </Form.Item>
          <Form.Item
            name="code"
            label="物料编码"
            rules={[
              { required: true, message: '请输入物料编码' },
              { pattern: /^[A-Za-z0-9_-]+$/, message: '编码只能包含字母、数字、下划线和中划线' },
            ]}
          >
            <Input placeholder="请输入物料编码" maxLength={30} />
          </Form.Item>
          <Form.Item
            name="type"
            label="物料类型"
            rules={[{ required: true, message: '请选择物料类型' }]}
          >
            <Select placeholder="请选择物料类型" options={materialTypeOptions} />
          </Form.Item>
          <Form.Item
            name="stockQty"
            label="库存数量"
            rules={[{ required: true, message: '请输入库存数量' }]}
          >
            <InputNumber min={0} precision={0} style={{ width: '100%' }} placeholder="请输入库存数量" />
          </Form.Item>
          <Form.Item
            name="unit"
            label="单位"
            rules={[{ required: true, message: '请输入单位' }]}
          >
            <Input placeholder="请输入单位" maxLength={20} />
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

export default MaterialManage;
