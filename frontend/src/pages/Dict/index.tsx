import React, { useState, useEffect } from "react";
import { message, Select, Table, Modal, Form, Input, Button, Space, Popconfirm, InputNumber } from 'antd';
import { Card } from "antd";
import dictApi from "@/api/dict";
import type { Dict, DictTypeVO } from "@/api/dict";
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined, ReloadOutlined } from '@ant-design/icons';
import Title from "antd/es/skeleton/Title";
import { renderMatches } from "react-router-dom";

const DictList: React.FC = () => {
    // 字典类型列表
    const [typesLoading, setTypesLoading] = useState(false);
    const [typeList, setTypeList] = useState<DictTypeVO[]>([]);

    // 字典项详情弹窗
    const [detailVisible, setDetailVisible] = useState(false);
    const [currentType, setCurrentType] = useState('');
    const [dictItems, setDictItems] = useState<Dict[]>([]);
    const [itemsLoading, setItemsLoading] = useState(false);

    // 新增/编辑字典项弹窗
    const [itemModalVisible, setItemModalVisible] = useState(false);
    const [itemFormData, setItemFormData] = useState<Partial<Dict>>({});
    const [itemForm] = Form.useForm();

    // 加载字典类型列表
    const loadTypes = async () => {
        setTypesLoading(true);
        try {
            const response = await dictApi.getTypes();
            if (response.code === 200) {
                setTypeList(response.data || []);
            }
        } catch (error) {
            console.error('获取字典类型失败:', error);
        } finally {
            setTypesLoading(false);
        }
    };

    useEffect(() => {
        loadTypes();
    }, []);

    // 查看字典类型详情
    const handleViewDetail = async (dictType: string) => {
        setCurrentType(dictType);
        setDetailVisible(true);
        setItemsLoading(true);
        try {
            const response = await dictApi.getByType(dictType);
            if (response.code === 200) {
                setDictItems(response.data || []);
            }
        } catch (error) {
            console.error('获取字典项失败:', error);
        } finally {
            setItemsLoading(false);
        }
    };

    // 新增字典项
    const handleAddItem = () => {
        setItemFormData({ dictType: currentType });
        itemForm.resetFields();
        itemForm.setFieldsValue({ dictType: currentType, status: 1, sort: 0 });
        setItemModalVisible(true);
    };

    // 编辑字典项
    const handleEditItem = (record: Dict) => {
        setItemFormData(record);
        itemForm.setFieldsValue(record);
        setItemModalVisible(true);
    };

    // 删除字典项
    const handleDeleteItem = async (id: number) => {
        try {
            const response = await dictApi.delete(id);
            if (response.code === 200) {
                message.success('删除成功');
                // 刷新当前类型的字典项
                const res = await dictApi.getByType(currentType);
                if (res.code === 200) {
                    setDictItems(res.data || []);
                }
                // 刷新类型列表（数量可能变化）
                loadTypes();
            } else {
                message.error(response.message || '删除失败');
            }
        } catch (error) {
            message.error('删除失败');
        }
    };

    // 提交字典项
    const handleItemSubmit = async () => {
        try {
            const values = await itemForm.validateFields();
            if (itemFormData.id) {
                const response = await dictApi.update(itemFormData.id, values);
                if (response.code === 200) {
                    message.success('更新成功');
                    setItemModalVisible(false);
                    itemForm.resetFields();
                    // 刷新
                    const res = await dictApi.getByType(currentType);
                    if (res.code === 200) {
                        setDictItems(res.data || []);
                    }
                } else {
                    message.error(response.message || '更新失败');
                }
            } else {
                const response = await dictApi.create(values);
                if (response.code === 200) {
                    message.success('创建成功');
                    setItemModalVisible(false);
                    itemForm.resetFields();
                    // 刷新
                    const res = await dictApi.getByType(currentType);
                    if (res.code === 200) {
                        setDictItems(res.data || []);
                    }
                    loadTypes();
                } else {
                    message.error(response.message || '创建失败');
                }
            }
        } catch (error) {
            message.error(itemFormData.id ? '更新失败' : '创建失败');
        }
    };

    // 字典类型表格列
    const typeColumns = [
        {
            title: '序号',
            dataIndex: 'index',
            render: (_: unknown, __: unknown, index: number) => index + 1,
        },
        {
            title: '字典类型',
            dataIndex: 'dictType',
            key: 'dictType',
        },
        {
            title: '字典项数量',
            dataIndex: 'itemCount',
            key: 'itemCount',
            width: 120,
        },
        {
            title: '操作',
            key: 'action',
            width: 120,
            render: (_: unknown, record: DictTypeVO) => (
                <Button type="link" icon={<EyeOutlined />} onClick={() => handleViewDetail(record.dictType)}>
                    查看详情
                </Button>
            ),
        },
    ];

    // 字典项表格列
    const itemColumns = [
        {
            title: '字典编码',
            dataIndex: 'dictCode',
            key: 'dictCode',
            width: 120,
        },
        {
            title: '字典标签',
            dataIndex: 'dictLabel',
            key: 'dictLabel',
            width: 120,
        },
        {
            title: '排序',
            dataIndex: 'sort',
            key: 'sort',
            width: 80,
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            width: 80,
            render: (status: number) => (
                <span style={{ color: status === 1 ? '#52c41a' : '#999' }}>
                    {status === 1 ? '启用' : '禁用'}
                </span>
            ),
        },
        {
            title: '操作',
            key: 'action',
            width: 150,
            render: (_: unknown, record: Dict) => (
                <Space size="small">
                    <Button type="link" size="small" icon={<EditOutlined />} onClick={() => handleEditItem(record)}>
                        编辑
                    </Button>
                    <Popconfirm
                        title="确定删除？"
                        okText="确定"
                        cancelText="取消"
                        onConfirm={() => handleDeleteItem(record.id)}
                    >
                        <Button type="link" size="small" icon={<DeleteOutlined />}>删除</Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ margin: 0 }}>数据字典</h2>
                <Button icon={<ReloadOutlined />} onClick={loadTypes}>刷新</Button>
            </div>
            <Card>
                <Table
                    loading={typesLoading}
                    dataSource={typeList}
                    columns={typeColumns}
                    pagination={false}
                    rowKey="dictType"
                />
            </Card>

            {/* 字典项详情弹窗 */}
            <Modal
                title={`字典类型：${currentType}`}
                open={detailVisible}
                onCancel={() => setDetailVisible(false)}
                footer={null}
                width={700}
            >
                <div style={{ marginBottom: 16 }}>
                    <Button type="primary" icon={<PlusOutlined />} onClick={handleAddItem}>
                        新增字典项
                    </Button>
                </div>
                <Table
                    loading={itemsLoading}
                    dataSource={dictItems}
                    columns={itemColumns}
                    pagination={false}
                    rowKey="id"
                    size="small"
                />
            </Modal>

            {/* 新增/编辑字典项弹窗 */}
            <Modal
                title={itemFormData.id ? '编辑字典项' : '新增字典项'}
                open={itemModalVisible}
                onOk={handleItemSubmit}
                onCancel={() => {
                    setItemModalVisible(false);
                    itemForm.resetFields();
                }}
            >
                <Form form={itemForm} layout="vertical">
                    <Form.Item label="字典类型" name="dictType">
                        <Input disabled />
                    </Form.Item>
                    <Form.Item label="字典编码" name="dictCode" rules={[{ required: true, message: '请输入字典编码' }]}>
                        <Input placeholder="如 raw、part、package" />
                    </Form.Item>
                    <Form.Item label="字典标签" name="dictLabel" rules={[{ required: true, message: '请输入字典标签' }]}>
                        <Input placeholder="如 原材料、零部件" />
                    </Form.Item>
                    <Form.Item label="排序" name="sort">
                        <InputNumber min={0} style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item label="状态" name="status" rules={[{ required: true }]}>
                        <Select options={[
                            { label: '启用', value: 1 },
                            { label: '禁用', value: 0 },
                        ]} />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default DictList;