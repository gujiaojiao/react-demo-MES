import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserInfo {
  id: number;
  username: string;
  role: string;
  avatar?: string;
}

export type LayoutMode = 'side' | 'top';

interface AppState {
  token: string | null;
  userInfo: UserInfo | null;
  sidebarCollapsed: boolean;
  themeColor: string;
  layoutMode: LayoutMode;
  sidebarWidth: number;
  setToken: (token: string | null) => void;
  setUserInfo: (userInfo: UserInfo | null) => void;
  toggleSidebar: () => void;
  logout: () => void;
  setThemeColor: (color: string) => void;
  setLayoutMode: (mode: LayoutMode) => void;
  setSidebarWidth: (width: number) => void;
}

const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      token: null,
      userInfo: null,
      sidebarCollapsed: false,
      themeColor: '#1890ff',
      layoutMode: 'side',
      sidebarWidth: 200,
      setToken: (token) => {
        // 同时存储到 localStorage，供 axios 拦截器使用
        if (token) {
          localStorage.setItem('token', token);
        } else {
          localStorage.removeItem('token');
        }
        set({ token });
      },
      setUserInfo: (userInfo) => set({ userInfo }),
      toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      logout: () => {
        localStorage.removeItem('token');
        set({ token: null, userInfo: null });
      },
      setThemeColor: (themeColor) => set({ themeColor }),
      setLayoutMode: (layoutMode) => set({ layoutMode }),
      setSidebarWidth: (sidebarWidth) => set({ sidebarWidth }),
    }),
    {
      name: 'app-storage',
    }
  )
);

export default useAppStore;
