import React, { useState, useEffect, useCallback } from "react";
import { message, Select, Tree, Tabs, type TableProps } from 'antd';
import { Card, Space, Table, Form, Input, Button, Modal, Popconfirm } from "antd";
import roleApi from "@/api/role";
import type { Role, RoleListParams } from "@/api/role";
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, ReloadOutlined } from '@ant-design/icons';

// 权限树数据
const permissionTreeData = [
    {
        title: '系统管理',
        key: 'system',
        children: [
            { title: '用户管理', key: 'user' },
            { title: '角色管理', key: 'role' },
            { title: '数据字典', key: 'dict' },
        ],
    },
    {
        title: 'MES 管理',
        key: 'mes',
        children: [
            { title: '产品管理', key: 'product' },
            { title: '物料管理', key: 'material' },
            { title: 'BOM 管理', key: 'bom' },
            { title: '工序管理', key: 'process' },
            { title: '工艺路线', key: 'route' },
            { title: '设备管理', key: 'device' },
            { title: '生产订单', key: 'order' },
        ],
    },
];

// 所有叶子节点权限
const allPermissions = ['user', 'role', 'dict', 'product', 'material', 'bom', 'process', 'route', 'device', 'order'];

const RoleList: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [dataSource, setDataSource] = useState<Role[]>([]);
    const [total, setTotal] = useState(0);
    const [modalVisible, setModalVisible] = useState(false);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
    });
    const [formData, setFormData] = useState<Partial<Role>>({});
    const [form] = Form.useForm();
    const [searchKeyword, setSearchKeyword] = useState('');
    const [checkedPermissions, setCheckedPermissions] = useState<string[]>([]);

    // 获取角色列表
    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const params: RoleListParams = {
                page: pagination.current,
                pageSize: pagination.pageSize,
                keyword: searchKeyword || undefined,
            }
            const response = await roleApi.getList(params);
            if (response.code === 200) {
                console.log('角色列表数据:', response.data);
                setDataSource(response.data?.list || []);
                setTotal(response.data?.total || 0);
                setLoading(false);
            } else {
                setDataSource([]);
                setTotal(0);
            }
        } catch (error: any) {
            console.error('获取角色列表失败:', error);
        } finally {
            setLoading(false);
        }

    }, [pagination.current, pagination.pageSize, searchKeyword]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // 新增角色
    const handleAdd = () => {
        setFormData({});
        form.resetFields();
        setCheckedPermissions([]);
        setModalVisible(true);
    };

    // 编辑角色
    const handleEdit = (record: Role) => {
        setFormData(record);
        form.setFieldsValue(record);
        // 解析 permissions 字符串为数组
        const perms = record.permissions ? record.permissions.split(',').filter(p => allPermissions.includes(p)) : [];
        setCheckedPermissions(perms);
        setModalVisible(true);
    };

    // 删除角色
    const handleDelete = async (id: number) => {
        try {
            const response = await roleApi.delete(id);
            if (response.code === 200) {
                message.success('角色删除成功');
                fetchData();
            } else {
                message.error(response.message || '角色删除失败');
            }
        } catch (error) {
            message.error('角色删除失败');
        }
    }

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            // 将权限数组转为逗号分隔字符串
            const submitData = {
                ...values,
                permissions: checkedPermissions.join(','),
            };
            if (formData.id) {
                const response = await roleApi.update(formData.id, submitData);
                if (response.code === 200) {
                    message.success('角色更新成功');
                    setModalVisible(false);
                    form.resetFields();
                    setCheckedPermissions([]);
                    fetchData();
                } else {
                    message.error(response.message || '角色更新失败');
                }
            } else {
                const response = await roleApi.create(submitData);
                if (response.code === 200) {
                    message.success('角色创建成功');
                    setModalVisible(false);
                    form.resetFields();
                    setCheckedPermissions([]);
                    fetchData();
                } else {
                    message.error(response.message || '角色创建失败');
                }
            }
        } catch (error) {
            message.error(formData.id ? '角色更新失败' : '角色创建失败');
        }
    };

    const reload = () => {
        setPagination({
            current: 1,
            pageSize: 10,
        });
        setSearchKeyword('');
    }

    const columns: TableProps<Role>['columns'] = [
        {
            title: '序号',
            dataIndex: 'id',
        },
        {
            title: '角色名称',
            dataIndex: 'name',
        },
        {
            title: '角色编码',
            dataIndex: 'code',
        },
        {
            title: '角色状态',
            dataIndex: 'status',
            render: (status) => (
                <span style={{ color: status === 1 ? '#52c41a' : '#999' }}>{status === 1 ? '启用' : '禁用'}</span>
            ),
        },
        {
            title: '角色描述',
            dataIndex: 'description',
        },
        {
            title: '操作',
            key: 'action',
            render: (_, record) => (
                <Space size="middle" align="center">
                    <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record)}>编辑</Button>
                    <Popconfirm title="确定要删除吗？" okText="确定" cancelText="取消" onConfirm={() => handleDelete(record.id)} onCancel={() => { message.info('取消删除') }}>
                        <Button type="link" icon={<DeleteOutlined />}>删除</Button>
                    </Popconfirm>

                </Space>
            )
        }
    ];
    return (
        <div>
            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ margin: 0 }}>· 角色管理</h2>
                <Space>
                    <Input.Search placeholder="搜索角色名称或编号" value={searchKeyword} onChange={(e) => setSearchKeyword(e.target.value)} onSearch={() => fetchData()} style={{ width: 250 }} enterButton={<SearchOutlined />} />
                    <Button icon={<ReloadOutlined />} onClick={reload}>
                        刷新
                    </Button>
                    <Button type="primary" icon={<PlusOutlined />} style={{ marginLeft: 8 }} onClick={handleAdd}>
                        新增
                    </Button>
                </Space>
            </div>
            <Card>
                <Table
                    loading={loading}
                    dataSource={dataSource}
                    columns={columns}
                    pagination={{
                        ...pagination,
                        total,
                        onChange: (page, pageSize) => {
                            setPagination({ current: page, pageSize });
                        },
                    }}
                />
            </Card>

            <Modal
                title={formData.id ? '编辑角色' : '新增角色'}
                open={modalVisible}
                onOk={handleSubmit}
                width={600}
                onCancel={() => {
                    setModalVisible(false);
                    form.resetFields();
                    setCheckedPermissions([]);
                }}
            >
                <Tabs
                    items={[
                        {
                            key: 'basic',
                            label: '基本信息',
                            children: (
                                <Form form={form} layout="vertical">
                                    <Form.Item label="角色名称" name="name" rules={[{ required: true, message: '请输入角色名称' }]}>
                                        <Input placeholder="请输入角色名称" />
                                    </Form.Item>
                                    <Form.Item label="角色编码" name="code" rules={[{ required: true, message: '请输入角色编码' }]}>
                                        <Input placeholder="请输入角色编码" />
                                    </Form.Item>
                                    <Form.Item label="角色状态" name="status" rules={[{ required: true, message: '请选择角色状态' }]}>
                                        <Select placeholder="请选择角色状态" options={[
                                            { label: '启用', value: 1 },
                                            { label: '禁用', value: 0 }
                                        ]} />
                                    </Form.Item>
                                    <Form.Item label="角色描述" name="description">
                                        <Input.TextArea placeholder="请输入角色描述" rows={3} />
                                    </Form.Item>
                                </Form>
                            ),
                        },
                        {
                            key: 'permission',
                            label: '权限配置',
                            children: (
                                <div>
                                    <p style={{ marginBottom: 8, color: '#666' }}>勾选角色可访问的菜单模块：</p>
                                    <Tree
                                        checkable
                                        checkedKeys={checkedPermissions}
                                        onCheck={(checked) => {
                                            // 只保留叶子节点的权限
                                            const checkedArr = checked as string[];
                                            setCheckedPermissions(checkedArr.filter(key => allPermissions.includes(key)));
                                        }}
                                        treeData={permissionTreeData}
                                    />
                                </div>
                            ),
                        },
                    ]}
                />
            </Modal>
        </div>

    );
};

export default RoleList;