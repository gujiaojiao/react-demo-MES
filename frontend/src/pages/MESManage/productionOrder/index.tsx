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
  CheckCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  PlayCircleOutlined,
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined,
  StopOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import orderApi from '@/api/mes/order';
import type {
  ProductionOrder,
  ProductionOrderListParams,
  ProductionOrderPayload,
} from '@/api/mes/order';
import productApi from '@/api/mes/product';
import type { Product } from '@/api/mes/product';
import routeApi from '@/api/mes/route';
import type { RouteItem } from '@/api/mes/route';
import '../product/index.css';

const statusOptions = [
  { label: '未开始', value: 0 },
  { label: '进行中', value: 1 },
  { label: '已完成', value: 2 },
  { label: '已取消', value: 3 },
];

const getStatusMeta = (status: number) => {
  switch (status) {
    case 1:
      return { color: 'processing', text: '进行中' };
    case 2:
      return { color: 'success', text: '已完成' };
    case 3:
      return { color: 'default', text: '已取消' };
    default:
      return { color: 'warning', text: '未开始' };
  }
};

const ProductionOrderManage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [dataSource, setDataSource] = useState<ProductionOrder[]>([]);
  const [total, setTotal] = useState(0);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [filterStatus, setFilterStatus] = useState<number | undefined>();
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const [modalVisible, setModalVisible] = useState(false);
  const [formData, setFormData] = useState<Partial<ProductionOrder>>({});
  const [productOptions, setProductOptions] = useState<Product[]>([]);
  const [routeOptions, setRouteOptions] = useState<RouteItem[]>([]);
  const [form] = Form.useForm();

  const fetchData = async () => {
    setLoading(true);
    try {
      const params: ProductionOrderListParams = {
        page: pagination.current,
        pageSize: pagination.pageSize,
        keyword: searchKeyword || undefined,
        status: filterStatus,
      };
      const response = await orderApi.getList(params);
      if (response.code === 200) {
        setDataSource(response.data?.list || []);
        setTotal(response.data?.total || 0);
      } else {
        message.error(response.message || '获取生产订单列表失败');
      }
    } catch {
      message.error('获取生产订单列表失败');
    } finally {
      setLoading(false);
    }
  };

  const fetchBaseOptions = async () => {
    try {
      const [productRes, routeRes] = await Promise.all([
        productApi.getList({ page: 1, pageSize: 1000 }),
        routeApi.getList({ page: 1, pageSize: 1000 }),
      ]);

      if (productRes.code === 200) {
        setProductOptions(productRes.data?.list || []);
      }
      if (routeRes.code === 200) {
        setRouteOptions(routeRes.data?.list || []);
      }
    } catch {
      message.error('加载产品或工艺路线选项失败');
    }
  };

  useEffect(() => {
    fetchData();
  }, [pagination.current, pagination.pageSize, filterStatus]);

  const handleSearch = () => {
    setPagination((prev) => ({ ...prev, current: 1 }));
    fetchData();
  };

  const openCreateModal = async () => {
    await fetchBaseOptions();
    setFormData({});
    form.resetFields();
    setModalVisible(true);
  };

  const openEditModal = async (record: ProductionOrder) => {
    await fetchBaseOptions();
    try {
      const response = await orderApi.getById(record.id);
      if (response.code !== 200 || !response.data) {
        message.error(response.message || '获取订单详情失败');
        return;
      }
      setFormData(response.data);
      form.setFieldsValue({
        orderNo: response.data.orderNo,
        productId: response.data.productId,
        routeId: response.data.routeId,
        quantity: response.data.quantity,
        planStartDate: response.data.planStartDate,
        planEndDate: response.data.planEndDate,
      });
      setModalVisible(true);
    } catch {
      message.error('获取订单详情失败');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await orderApi.delete(id);
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
      if (values.planStartDate && values.planEndDate && values.planEndDate < values.planStartDate) {
        message.error('计划结束日期不能早于计划开始日期');
        return;
      }

      const payload: ProductionOrderPayload = {
        orderNo: values.orderNo || undefined,
        productId: values.productId,
        routeId: values.routeId,
        quantity: values.quantity,
        planStartDate: values.planStartDate || undefined,
        planEndDate: values.planEndDate || undefined,
      };

      setSubmitting(true);
      const response = formData.id
        ? await orderApi.update(formData.id, payload)
        : await orderApi.create(payload);

      if (response.code === 200) {
        message.success(formData.id ? '更新成功' : '创建成功');
        setModalVisible(false);
        form.resetFields();
        fetchData();
      } else {
        message.error(response.message || '保存失败');
      }
    } catch (error: any) {
      const errorMsg = error?.response?.data?.message || error?.message || '保存失败';
      message.error(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusAction = async (
    id: number,
    action: 'start' | 'complete' | 'cancel',
    successMessage: string
  ) => {
    try {
      const response =
        action === 'start'
          ? await orderApi.start(id)
          : action === 'complete'
            ? await orderApi.complete(id)
            : await orderApi.cancel(id);

      if (response.code === 200) {
        message.success(successMessage);
        fetchData();
      } else {
        message.error(response.message || '操作失败');
      }
    } catch (error: any) {
      message.error(error?.response?.data?.message || '操作失败');
    }
  };

  const columns: ColumnsType<ProductionOrder> = [
    { title: 'ID', dataIndex: 'id', width: 80, align: 'center' },
    { title: '订单号', dataIndex: 'orderNo', width: 180 },
    { title: '产品名称', dataIndex: 'productName', width: 160 },
    { title: '产品编码', dataIndex: 'productCode', width: 160 },
    { title: '工艺路线', dataIndex: 'routeName', width: 160 },
    { title: '路线编码', dataIndex: 'routeCode', width: 160 },
    { title: '数量', dataIndex: 'quantity', width: 100, align: 'right' },
    { title: '计划开始', dataIndex: 'planStartDate', width: 140, align: 'center' },
    { title: '计划结束', dataIndex: 'planEndDate', width: 140, align: 'center' },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      align: 'center',
      render: (status: number) => {
        const meta = getStatusMeta(status);
        return <Tag color={meta.color}>{meta.text}</Tag>;
      },
    },
    { title: '创建时间', dataIndex: 'createdAt', width: 180 },
    {
      title: '操作',
      key: 'action',
      width: 360,
      align: 'center',
      fixed: 'right',
      render: (_, record) => (
        <Space size="small" wrap>
          {record.status === 0 ? (
            <>
              <Button type="link" size="small" icon={<EditOutlined />} onClick={() => openEditModal(record)}>
                编辑
              </Button>
              <Popconfirm
                title="确定删除该生产订单吗？"
                okText="确定"
                cancelText="取消"
                onConfirm={() => handleDelete(record.id)}
              >
                <Button type="link" size="small" danger icon={<DeleteOutlined />}>
                  删除
                </Button>
              </Popconfirm>
              <Popconfirm
                title="确定将该订单开工吗？"
                okText="确定"
                cancelText="取消"
                onConfirm={() => handleStatusAction(record.id, 'start', '开工成功')}
              >
                <Button type="link" size="small" icon={<PlayCircleOutlined />}>
                  开工
                </Button>
              </Popconfirm>
            </>
          ) : null}
          {record.status === 1 ? (
            <>
              <Popconfirm
                title="确定将该订单完工吗？"
                okText="确定"
                cancelText="取消"
                onConfirm={() => handleStatusAction(record.id, 'complete', '完工成功')}
              >
                <Button type="link" size="small" icon={<CheckCircleOutlined />}>
                  完工
                </Button>
              </Popconfirm>
              <Popconfirm
                title="确定取消该订单吗？"
                okText="确定"
                cancelText="取消"
                onConfirm={() => handleStatusAction(record.id, 'cancel', '订单已取消')}
              >
                <Button type="link" size="small" danger icon={<StopOutlined />}>
                  取消
                </Button>
              </Popconfirm>
            </>
          ) : null}
        </Space>
      ),
    },
  ];

  return (
    <div className="product-manage">
      <div className="topContent">
        <h2 className="page-title">生产订单管理</h2>
        <Space size="middle" wrap>
          <Input.Search
            placeholder="搜索订单号"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            onSearch={handleSearch}
            style={{ width: 250 }}
            enterButton={<SearchOutlined />}
            allowClear
          />
          <Select
            placeholder="筛选订单状态"
            allowClear
            style={{ width: 160 }}
            value={filterStatus}
            options={statusOptions}
            onChange={(value) => {
              setFilterStatus(value);
              setPagination((prev) => ({ ...prev, current: 1 }));
            }}
          />
          <Button icon={<ReloadOutlined />} onClick={fetchData}>
            刷新
          </Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={openCreateModal}>
            新增订单
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
          scroll={{ x: 1800 }}
          size="middle"
        />
      </Card>

      <Modal
        title={formData.id ? '编辑生产订单' : '新增生产订单'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
        }}
        destroyOnClose
        width={640}
        okText="保存"
        cancelText="取消"
        confirmLoading={submitting}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="orderNo" label="订单号">
            <Input placeholder="不填则由系统自动生成" maxLength={50} />
          </Form.Item>
          <Form.Item
            name="productId"
            label="产品"
            rules={[{ required: true, message: '请选择产品' }]}
          >
            <Select
              placeholder="请选择产品"
              options={productOptions
                .filter((item) => item.status === 1)
                .map((item) => ({
                  label: `${item.name} (${item.code})`,
                  value: item.id,
                }))}
              showSearch
              optionFilterProp="label"
            />
          </Form.Item>
          <Form.Item
            name="routeId"
            label="工艺路线"
            rules={[{ required: true, message: '请选择工艺路线' }]}
          >
            <Select
              placeholder="请选择工艺路线"
              options={routeOptions
                .filter((item) => item.status === 1)
                .map((item) => ({
                  label: `${item.name} (${item.code})`,
                  value: item.id,
                }))}
              showSearch
              optionFilterProp="label"
            />
          </Form.Item>
          <Form.Item
            name="quantity"
            label="生产数量"
            rules={[{ required: true, message: '请输入生产数量' }]}
          >
            <InputNumber min={1} precision={0} style={{ width: '100%' }} placeholder="请输入生产数量" />
          </Form.Item>
          <Form.Item name="planStartDate" label="计划开始日期">
            <Input type="date" />
          </Form.Item>
          <Form.Item name="planEndDate" label="计划结束日期">
            <Input type="date" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProductionOrderManage;
