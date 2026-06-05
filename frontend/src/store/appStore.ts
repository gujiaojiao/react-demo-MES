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
      setToken: (token) => set({ token }),
      setUserInfo: (userInfo) => set({ userInfo }),
      toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      logout: () => set({ token: null, userInfo: null }),
      setThemeColor: (themeColor) => set({ themeColor }),
      setLayoutMode: (layoutMode) => set({ layoutMode }),
      setSidebarWidth: (sidebarWidth) => set({ sidebarWidth }),
    }),
    {
      name: 'app-storage',
      version: 2,
      migrate: (persistedState: any) => ({
        token: null,
        userInfo: null,
        sidebarCollapsed: persistedState?.sidebarCollapsed ?? false,
        themeColor: persistedState?.themeColor ?? '#1890ff',
        layoutMode: persistedState?.layoutMode ?? 'side',
        sidebarWidth: persistedState?.sidebarWidth ?? 200,
      }),
      partialize: (state) => ({
        token: null,
        userInfo: null,
        sidebarCollapsed: state.sidebarCollapsed,
        themeColor: state.themeColor,
        layoutMode: state.layoutMode,
        sidebarWidth: state.sidebarWidth,
      }),
    }
  )
);

export default useAppStore;
