import React from 'react';
import { Card, Form, ColorPicker, Radio, Slider, Space, message } from 'antd';
import { ToolOutlined } from '@ant-design/icons';
import useAppStore from '@/store/appStore';
import type { LayoutMode } from '@/store/appStore';

const SystemConfig: React.FC = () => {
  const { themeColor, layoutMode, sidebarWidth, setThemeColor, setLayoutMode, setSidebarWidth } = useAppStore();

  const handleThemeColorChange = (color: string) => {
    setThemeColor(color);
    message.success('主题色已更新');
  };

  const handleLayoutModeChange = (mode: LayoutMode) => {
    setLayoutMode(mode);
    message.success('布局模式已更新');
  };

  const handleSidebarWidthChange = (width: number) => {
    setSidebarWidth(width);
  };

  const presetColors = [
    '#1890ff',
    '#722ed1',
    '#13c2c2',
    '#52c41a',
    '#faad14',
    '#f5222d',
    '#eb2f96',
  ];

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center' }}>
        <ToolOutlined style={{ fontSize: 24, marginRight: 8 }} />
        <h2 style={{ margin: 0 }}>系统配置</h2>
      </div>

      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Card title="主题设置" bordered={false}>
          <Form layout="vertical">
            <Form.Item label="主题色">
              <Space>
                <ColorPicker
                  value={themeColor}
                  onChange={(color) => handleThemeColorChange(color.toHexString())}
                  showText
                  presets={[
                    {
                      label: '推荐',
                      colors: presetColors,
                    },
                  ]}
                />
                <span style={{ color: '#666' }}>
                  选择主题色，将应用到按钮、链接等组件
                </span>
              </Space>
            </Form.Item>
          </Form>
        </Card>

        <Card title="布局设置" bordered={false}>
          <Form layout="vertical">
            <Form.Item label="布局模式">
              <Radio.Group
                value={layoutMode}
                onChange={(e) => handleLayoutModeChange(e.target.value)}
              >
                <Radio.Button value="side">侧边布局</Radio.Button>
                <Radio.Button value="top">上中下布局</Radio.Button>
              </Radio.Group>
            </Form.Item>
            {layoutMode === 'side' && (
              <Form.Item label={`菜单栏宽度: ${sidebarWidth}px`}>
                <Slider
                  min={150}
                  max={300}
                  value={sidebarWidth}
                  onChange={handleSidebarWidthChange}
                  style={{ width: 300 }}
                />
              </Form.Item>
            )}
          </Form>
        </Card>

        <Card title="预览说明" bordered={false}>
          <div style={{ color: '#666', lineHeight: 1.8 }}>
            <p><strong>主题色：</strong>更改后，系统按钮、链接等组件的颜色会实时变化。</p>
            <p><strong>布局模式：</strong></p>
            <ul style={{ paddingLeft: 20 }}>
              <li>侧边布局：经典后台管理布局，菜单在左侧</li>
              <li>上中下布局：菜单在顶部，适合内容型系统</li>
            </ul>
            <p><strong>菜单栏宽度：</strong>仅在侧边布局模式下生效，可调整左侧菜单的宽度。</p>
          </div>
        </Card>
      </Space>
    </div>
  );
};

export default SystemConfig;