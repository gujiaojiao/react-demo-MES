import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import AppRoutes from '@/router';
import useAppStore from '@/store/appStore';

const App: React.FC = () => {
  const themeColor = useAppStore((state) => state.themeColor);

  return (
    <ConfigProvider
      locale={zhCN}
      theme={{
        token: {
          colorPrimary: themeColor,
          borderRadius: 4,
        },
      }}
    >
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </ConfigProvider>
  );
};

export default App;
