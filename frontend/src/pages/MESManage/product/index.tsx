import React, { useState, useEffect, useCallback } from 'react';
import { Table, Button, Space, Modal, Form, Input, Select, message, Popconfirm, Card, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import productApi from '@/api/mes/product';
import type { Product, ProductListParams } from '@/api/mes/product';
import './index.css';

const ProductManage: React.FC = () => {
    // 列表数据状态
    const [loading, setLoading] = useState(false);
    const [dataSource, setDataSource] = useState<Product[]>([]);
    const [total, setTotal] = useState(0);

    // 搜索关键词
    const [searchKeyword, setSearchKeyword] = useState('');

    // 分页状态
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
    });

    // 弹窗状态
    const [modalVisible, setModalVisible] = useState(false);
    const [formData, setFormData] = useState<Partial<Product>>({});
    const [form] = Form.useForm();

    // 获取产品列表数据
    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const params: ProductListParams = {
                page: pagination.current,
                pageSize: pagination.pageSize,
                keyword: searchKeyword || undefined,
            };
            const response = await productApi.getList(params);
            if (response.code === 200) {
                setDataSource(response.data?.list || []);
                setTotal(response.data?.total || 0);
            } else {
                message.error(response.message || '获取产品列表失败');
                setDataSource([]);
                setTotal(0);
            }
        } catch (error: any) {
            message.error('获取失败');
            setDataSource([]);
            setTotal(0);
        } finally {
            setLoading(false);
        }
    }, [pagination.current, pagination.pageSize, searchKeyword]);

    // 初始化加载
    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // 新增产品
    const handleAdd = () => {
        setFormData({});
        form.resetFields();
        setModalVisible(true);
    };

    // 编辑产品
    const handleEdit = (record: Product) => {
        setFormData(record);
        form.setFieldsValue(record);
        setModalVisible(true);
    };

    // 删除产品
    const handleDelete = async (id: number) => {
        try {
            const response = await productApi.delete(id);
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

    // 提交表单（新增或编辑）
    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            if (formData.id) {
                const response = await productApi.update(formData.id, values);
                if (response.code === 200) {
                    message.success('更新成功');
                    setModalVisible(false);
                    form.resetFields();
                    fetchData();
                } else {
                    message.error(response.message || '更新失败');
                }
            } else {
                const response = await productApi.create(values);
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

    // 分页变化
    const handleTableChange = (pag: any) => {
        setPagination({
            current: pag.current,
            pageSize: pag.pageSize,
        });
    };

    // 搜索
    const handleSearch = () => {
        setPagination({ ...pagination, current: 1 });
    };

    // 表格列定义
    const columns: ColumnsType<Product> = [
        {
            title: 'ID',
            dataIndex: 'id',
            width: 80,
            align: 'center',
        },
        {
            title: '产品名称',
            dataIndex: 'name',
            width: 150,
        },
        {
            title: '产品编码',
            dataIndex: 'code',
            width: 120,
        },
        {
            title: '产品规格',
            dataIndex: 'spec',
            width: 120,
        },
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
        {
            title: '产品描述',
            dataIndex: 'description',
            ellipsis: true,
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
            align: 'center',
            fixed: 'right',
            render: (_, record) => (
                <Space>
                    <Button
                        type="link"
                        size="small"
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(record)}
                    >
                        编辑
                    </Button>
                    <Popconfirm
                        title="确定删除该产品吗？"
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
            {/* 顶部区域：标题 + 操作按钮 */}
            <div className="topContent">
                <h2 className="page-title">产品管理</h2>
                <Space size="middle">
                    <Input.Search
                        placeholder="搜索产品名称或编码"
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
                        新增产品
                    </Button>
                </Space>
            </div>

            {/* 数据表格 */}
            <Card className="table-card">
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
                        showTotal: (total) => `共 ${total} 条记录`,
                    }}
                    onChange={handleTableChange}
                    scroll={{ x: 1000 }}
                    size="middle"
                />
            </Card>

            {/* 新增/编辑弹窗 */}
            <Modal
                title={formData.id ? '编辑产品' : '新增产品'}
                open={modalVisible}
                onOk={handleSubmit}
                onCancel={() => {
                    setModalVisible(false);
                    form.resetFields();
                }}
                destroyOnClose={true}
                width={600}
                okText="保存"
                cancelText="取消"
            >
                <Form form={form} layout="vertical" initialValues={{ status: 1 }}>
                    <Form.Item
                        name="name"
                        label="产品名称"
                        rules={[{ required: true, message: '请输入产品名称' }]}
                    >
                        <Input placeholder="请输入产品名称" maxLength={50} />
                    </Form.Item>
                    <Form.Item
                        name="code"
                        label="产品编码"
                        rules={[
                            { required: true, message: '请输入产品编码' },
                            { pattern: /^[A-Za-z0-9_-]+$/, message: '编码只能包含字母、数字、下划线和横线' }
                        ]}
                    >
                        <Input placeholder="请输入产品编码" maxLength={30} />
                    </Form.Item>
                    <Form.Item name="spec" label="产品规格">
                        <Input placeholder="请输入产品规格" maxLength={50} />
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
                    <Form.Item name="description" label="产品描述">
                        <Input.TextArea
                            placeholder="请输入产品描述"
                            rows={4}
                            maxLength={200}
                            showCount
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default ProductManage;
