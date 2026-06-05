import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Alert,
  Button,
  Card,
  Descriptions,
  Empty,
  Form,
  InputNumber,
  Modal,
  Popconfirm,
  Select,
  Space,
  Table,
  Tag,
  Typography,
  message,
} from 'antd';
import {
  ArrowLeftOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import bomApi from '@/api/mes/bom';
import type { BomItem } from '@/api/mes/bom';
import materialApi from '@/api/mes/material';
import type { Material } from '@/api/mes/material';
import productApi from '@/api/mes/product';
import type { Product } from '@/api/mes/product';
import '../product/index.css';

const { Title, Text } = Typography;

const BomManage: React.FC = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  const [bomList, setBomList] = useState<BomItem[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<Partial<BomItem> | null>(null);
  const [form] = Form.useForm();

  const numericProductId = Number(productId);
  const isInvalidProductId = Number.isNaN(numericProductId) || numericProductId <= 0;

  const enabledMaterials = materials.filter((item) => item.status === 1);

  const loadPageData = async () => {
    if (isInvalidProductId) {
      return;
    }

    setLoading(true);
    try {
      const [productRes, bomRes, materialRes] = await Promise.all([
        productApi.getById(numericProductId),
        bomApi.getListByProductId(numericProductId),
        materialApi.getList({ page: 1, pageSize: 1000 }),
      ]);

      if (productRes.code !== 200 || !productRes.data) {
        throw new Error(productRes.message || '获取产品信息失败');
      }

      if (bomRes.code !== 200) {
        throw new Error(bomRes.message || '获取BOM列表失败');
      }

      if (materialRes.code !== 200) {
        throw new Error(materialRes.message || '获取物料列表失败');
      }

      setProduct(productRes.data);
      setBomList(bomRes.data || []);
      setMaterials(materialRes.data?.list || []);
    } catch (error: any) {
      message.error(error?.message || '加载BOM页面失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPageData();
  }, [productId]);

  const openCreateModal = () => {
    setEditingRecord(null);
    form.resetFields();
    setModalVisible(true);
  };

  const openEditModal = (record: BomItem) => {
    setEditingRecord(record);
    form.setFieldsValue({ materialId: record.materialId, quantity: record.quantity });
    setModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await bomApi.delete(id);
      if (response.code === 200) {
        message.success('删除成功');
        loadPageData();
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
      if (editingRecord?.id) {
        const response = await bomApi.update(editingRecord.id, { quantity: values.quantity });
        if (response.code === 200) {
          message.success('更新成功');
          setModalVisible(false);
          form.resetFields();
          loadPageData();
        } else {
          message.error(response.message || '更新失败');
        }
        return;
      }

      const response = await bomApi.create({
        productId: numericProductId,
        materialId: values.materialId,
        quantity: values.quantity,
      });
      if (response.code === 200) {
        message.success('创建成功');
        setModalVisible(false);
        form.resetFields();
        loadPageData();
      } else {
        message.error(response.message || '创建失败');
      }
    } catch (error: any) {
      const errorMsg = error?.response?.data?.message || error?.message || '保存失败';
      message.error(errorMsg);
    }
  };

  const materialOptions = enabledMaterials.map((item) => ({
    label: `${item.name} (${item.code})`,
    value: item.id,
    disabled: !editingRecord && bomList.some((bomItem) => bomItem.materialId === item.id),
  }));

  const columns: ColumnsType<BomItem> = [
    { title: '物料名称', dataIndex: 'materialName', width: 180 },
    { title: '物料编码', dataIndex: 'materialCode', width: 160 },
    {
      title: '物料类型',
      dataIndex: 'materialType',
      width: 120,
      render: (value: string) => {
        const map: Record<string, string> = {
          raw: '原料',
          part: '零部件',
          package: '包装物',
        };
        return map[value] || value;
      },
    },
    { title: '单位', dataIndex: 'unit', width: 100, align: 'center' },
    { title: '用量', dataIndex: 'quantity', width: 100, align: 'right' },
    { title: '创建时间', dataIndex: 'createdAt', width: 180 },
    {
      title: '操作',
      key: 'action',
      width: 180,
      align: 'center',
      render: (_, record) => (
        <Space size="small">
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => openEditModal(record)}>
            编辑
          </Button>
          <Popconfirm
            title="确定删除该BOM明细吗？"
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

  if (isInvalidProductId) {
    return (
      <Alert
        type="error"
        showIcon
        message="产品参数无效"
        description="当前页面缺少有效的产品 ID，请返回产品管理页面重新进入。"
        action={
          <Button size="small" onClick={() => navigate('/mes/production')}>
            返回产品管理
          </Button>
        }
      />
    );
  }

  return (
    <div className="product-manage">
      <div className="topContent">
        <div>
          <Button
            type="link"
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate('/mes/production')}
            style={{ paddingLeft: 0 }}
          >
            返回产品管理
          </Button>
          <Title level={4} style={{ margin: 0 }}>
            BOM维护
          </Title>
          {product ? <Text type="secondary">为产品维护所需物料及用量</Text> : null}
        </div>
        <Space>
          <Button icon={<ReloadOutlined />} onClick={loadPageData}>
            刷新
          </Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={openCreateModal}>
            新增明细
          </Button>
        </Space>
      </div>

      <Card className="table-card" style={{ marginBottom: 16 }}>
        {product ? (
          <Descriptions title="产品信息" column={2}>
            <Descriptions.Item label="产品名称">{product.name}</Descriptions.Item>
            <Descriptions.Item label="产品编码">{product.code}</Descriptions.Item>
            <Descriptions.Item label="产品规格">{product.spec || '-'}</Descriptions.Item>
            <Descriptions.Item label="状态">
              <Tag color={product.status === 1 ? 'green' : 'default'}>
                {product.status === 1 ? '启用' : '禁用'}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="产品描述" span={2}>
              {product.description || '-'}
            </Descriptions.Item>
          </Descriptions>
        ) : (
          <Empty description="未加载到产品信息" />
        )}
      </Card>

      <Card className="table-card">
        <Table
          columns={columns}
          dataSource={bomList}
          loading={loading}
          rowKey="id"
          locale={{ emptyText: <Empty description="当前产品还没有BOM明细" /> }}
          pagination={false}
          scroll={{ x: 1000 }}
          size="middle"
        />
      </Card>

      <Modal
        title={editingRecord?.id ? '编辑BOM明细' : '新增BOM明细'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
        }}
        destroyOnClose
        okText="保存"
        cancelText="取消"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="materialId"
            label="物料"
            rules={[{ required: true, message: '请选择物料' }]}
          >
            <Select
              placeholder="请选择物料"
              options={materialOptions}
              disabled={Boolean(editingRecord?.id)}
              showSearch
              optionFilterProp="label"
            />
          </Form.Item>
          <Form.Item
            name="quantity"
            label="用量"
            rules={[{ required: true, message: '请输入用量' }]}
          >
            <InputNumber min={1} precision={0} style={{ width: '100%' }} placeholder="请输入用量" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default BomManage;
