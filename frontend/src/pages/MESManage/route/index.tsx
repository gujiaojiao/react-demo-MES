import React, { useEffect, useMemo, useState } from 'react';
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
  Typography,
  message,
} from 'antd';
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import processApi from '@/api/mes/process';
import type { ProcessItem } from '@/api/mes/process';
import routeApi from '@/api/mes/route';
import type { RouteDetail, RouteItem, RoutePayload } from '@/api/mes/route';
import '../product/index.css';

const { Text } = Typography;

interface RouteProcessRow {
  key: string;
  processId?: number;
  sequence?: number;
}

const RouteManage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState<RouteItem[]>([]);
  const [total, setTotal] = useState(0);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });
  const [routeModalVisible, setRouteModalVisible] = useState(false);
  const [routeFormData, setRouteFormData] = useState<Partial<RouteItem>>({});
  const [routeForm] = Form.useForm();

  const [processModalVisible, setProcessModalVisible] = useState(false);
  const [currentRoute, setCurrentRoute] = useState<RouteDetail | null>(null);
  const [processRows, setProcessRows] = useState<RouteProcessRow[]>([]);
  const [processOptions, setProcessOptions] = useState<ProcessItem[]>([]);
  const [savingProcesses, setSavingProcesses] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await routeApi.getList({
        page: pagination.current,
        pageSize: pagination.pageSize,
        keyword: searchKeyword || undefined,
      });
      if (response.code === 200) {
        setDataSource(response.data?.list || []);
        setTotal(response.data?.total || 0);
      } else {
        message.error(response.message || '获取工艺路线列表失败');
      }
    } catch {
      message.error('获取工艺路线列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [pagination.current, pagination.pageSize]);

  const enabledProcesses = useMemo(
    () => processOptions.filter((item) => item.status === 1),
    [processOptions]
  );

  const handleSearch = () => {
    setPagination((prev) => ({ ...prev, current: 1 }));
    fetchData();
  };

  const handleAddRoute = () => {
    setRouteFormData({});
    routeForm.resetFields();
    routeForm.setFieldsValue({ status: 1 });
    setRouteModalVisible(true);
  };

  const handleEditRoute = (record: RouteItem) => {
    setRouteFormData(record);
    routeForm.setFieldsValue(record);
    setRouteModalVisible(true);
  };

  const handleDeleteRoute = async (id: number) => {
    try {
      const response = await routeApi.delete(id);
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

  const handleSubmitRoute = async () => {
    try {
      const values = await routeForm.validateFields();
      const payload: RoutePayload = {
        name: values.name,
        code: values.code,
        description: values.description,
        status: values.status,
      };
      if (routeFormData.id) {
        const response = await routeApi.update(routeFormData.id, payload);
        if (response.code === 200) {
          message.success('更新成功');
          setRouteModalVisible(false);
          routeForm.resetFields();
          fetchData();
        } else {
          message.error(response.message || '更新失败');
        }
      } else {
        const response = await routeApi.create(payload);
        if (response.code === 200) {
          message.success('创建成功');
          setRouteModalVisible(false);
          routeForm.resetFields();
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

  const openProcessModal = async (routeId: number) => {
    try {
      const [routeRes, processRes] = await Promise.all([
        routeApi.getWithProcesses(routeId),
        processApi.getList({ page: 1, pageSize: 1000 }),
      ]);

      if (routeRes.code !== 200 || !routeRes.data) {
        throw new Error(routeRes.message || '获取路线详情失败');
      }
      if (processRes.code !== 200) {
        throw new Error(processRes.message || '获取工序列表失败');
      }

      setCurrentRoute(routeRes.data);
      setProcessOptions(processRes.data?.list || []);
      setProcessRows(
        (routeRes.data.processes || []).map((item, index) => ({
          key: `${item.processId}-${index}`,
          processId: item.processId,
          sequence: item.sequence,
        }))
      );
      setProcessModalVisible(true);
    } catch (error: any) {
      message.error(error?.message || '打开工序维护失败');
    }
  };

  const addProcessRow = () => {
    setProcessRows((prev) => [
      ...prev,
      {
        key: `new-${Date.now()}-${prev.length}`,
      },
    ]);
  };

  const updateProcessRow = (key: string, patch: Partial<RouteProcessRow>) => {
    setProcessRows((prev) =>
      prev.map((item) => (item.key === key ? { ...item, ...patch } : item))
    );
  };

  const removeProcessRow = (key: string) => {
    setProcessRows((prev) => prev.filter((item) => item.key !== key));
  };

  const saveProcesses = async () => {
    if (!currentRoute) {
      return;
    }

    if (processRows.length === 0) {
      message.warning('请至少保留一个工序');
      return;
    }

    const seen = new Set<number>();
    for (const row of processRows) {
      if (!row.processId) {
        message.error('请选择工序');
        return;
      }
      if (!row.sequence || row.sequence <= 0) {
        message.error('工序顺序必须大于 0');
        return;
      }
      if (seen.has(row.processId)) {
        message.error('同一路线中不能重复添加工序');
        return;
      }
      seen.add(row.processId);
    }

    setSavingProcesses(true);
    try {
      const payload: RoutePayload = {
        name: currentRoute.name,
        code: currentRoute.code,
        description: currentRoute.description,
        status: currentRoute.status,
        processes: processRows.map((item) => ({
          processId: item.processId!,
          sequence: item.sequence!,
        })),
      };

      const response = await routeApi.update(currentRoute.id, payload);
      if (response.code === 200) {
        message.success('工序维护成功');
        setProcessModalVisible(false);
        setCurrentRoute(null);
        setProcessRows([]);
        fetchData();
      } else {
        message.error(response.message || '工序维护失败');
      }
    } catch (error: any) {
      message.error(error?.response?.data?.message || error?.message || '工序维护失败');
    } finally {
      setSavingProcesses(false);
    }
  };

  const routeColumns: ColumnsType<RouteItem> = [
    { title: 'ID', dataIndex: 'id', width: 80, align: 'center' },
    { title: '路线名称', dataIndex: 'name', width: 180 },
    { title: '路线编码', dataIndex: 'code', width: 160 },
    { title: '路线描述', dataIndex: 'description', ellipsis: true },
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
      width: 260,
      align: 'center',
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<SettingOutlined />}
            onClick={() => openProcessModal(record.id)}
          >
            维护工序
          </Button>
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => handleEditRoute(record)}>
            编辑
          </Button>
          <Popconfirm
            title="确定删除该工艺路线吗？"
            okText="确定"
            cancelText="取消"
            onConfirm={() => handleDeleteRoute(record.id)}
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
        <h2 className="page-title">工艺路线管理</h2>
        <Space size="middle">
          <Input.Search
            placeholder="搜索路线名称或编码"
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
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAddRoute}>
            新增路线
          </Button>
        </Space>
      </div>

      <Card className="table-card">
        <Table
          columns={routeColumns}
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
        title={routeFormData.id ? '编辑工艺路线' : '新增工艺路线'}
        open={routeModalVisible}
        onOk={handleSubmitRoute}
        onCancel={() => {
          setRouteModalVisible(false);
          routeForm.resetFields();
        }}
        destroyOnClose
        width={600}
        okText="保存"
        cancelText="取消"
      >
        <Form form={routeForm} layout="vertical" initialValues={{ status: 1 }}>
          <Form.Item
            name="name"
            label="路线名称"
            rules={[{ required: true, message: '请输入路线名称' }]}
          >
            <Input placeholder="请输入路线名称" maxLength={50} />
          </Form.Item>
          <Form.Item
            name="code"
            label="路线编码"
            rules={[
              { required: true, message: '请输入路线编码' },
              { pattern: /^[A-Za-z0-9_-]+$/, message: '编码只能包含字母、数字、下划线和中划线' },
            ]}
          >
            <Input placeholder="请输入路线编码" maxLength={30} />
          </Form.Item>
          <Form.Item name="description" label="路线描述">
            <Input.TextArea placeholder="请输入路线描述" rows={4} maxLength={200} showCount />
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

      <Modal
        title="维护路线工序"
        open={processModalVisible}
        onOk={saveProcesses}
        onCancel={() => {
          setProcessModalVisible(false);
          setCurrentRoute(null);
          setProcessRows([]);
        }}
        confirmLoading={savingProcesses}
        width={860}
        okText="保存工序"
        cancelText="取消"
        destroyOnClose
      >
        {currentRoute ? (
          <>
            <Card size="small" style={{ marginBottom: 16 }}>
              <Space direction="vertical" size={4}>
                <Text strong>{currentRoute.name}</Text>
                <Text type="secondary">编码：{currentRoute.code}</Text>
                <Text type="secondary">描述：{currentRoute.description || '-'}</Text>
              </Space>
            </Card>

            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
              <Text type="secondary">维护该路线下的工序组成与执行顺序</Text>
              <Button type="dashed" icon={<PlusOutlined />} onClick={addProcessRow}>
                新增工序
              </Button>
            </div>

            <Table<RouteProcessRow>
              rowKey="key"
              pagination={false}
              dataSource={processRows}
              locale={{ emptyText: '当前路线还没有工序，请先新增' }}
              columns={[
                {
                  title: '顺序',
                  dataIndex: 'sequence',
                  width: 120,
                  render: (_, record) => (
                    <InputNumber
                      min={1}
                      precision={0}
                      value={record.sequence}
                      onChange={(value) =>
                        updateProcessRow(record.key, {
                          sequence: typeof value === 'number' ? value : undefined,
                        })
                      }
                      style={{ width: '100%' }}
                    />
                  ),
                },
                {
                  title: '工序',
                  dataIndex: 'processId',
                  render: (_, record) => (
                    <Select
                      placeholder="请选择工序"
                      value={record.processId}
                      options={enabledProcesses.map((item) => ({
                        label: `${item.name} (${item.code})`,
                        value: item.id,
                      }))}
                      onChange={(value) => updateProcessRow(record.key, { processId: value })}
                      showSearch
                      optionFilterProp="label"
                    />
                  ),
                },
                {
                  title: '操作',
                  width: 100,
                  align: 'center',
                  render: (_, record) => (
                    <Button type="link" danger size="small" onClick={() => removeProcessRow(record.key)}>
                      删除
                    </Button>
                  ),
                },
              ]}
            />
          </>
        ) : null}
      </Modal>
    </div>
  );
};

export default RouteManage;
