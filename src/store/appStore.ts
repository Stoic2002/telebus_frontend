import { create } from 'zustand';

export interface AppState {
  // UI State
  sidebarOpen: boolean;
  isMobile: boolean;
  loading: boolean;
  
  // Modal States
  modals: {
    [key: string]: boolean;
  };
  
  // Current active menu/page
  activeMenu: string;
  
  // Global error handling
  globalError: string | null;
  
  // Theme
  theme: 'light' | 'dark';
}

export interface AppActions {
  // Sidebar actions
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  
  // Mobile detection
  setIsMobile: (isMobile: boolean) => void;
  
  // Loading actions
  setLoading: (loading: boolean) => void;
  
  // Modal actions
  openModal: (modalKey: string) => void;
  closeModal: (modalKey: string) => void;
  closeAllModals: () => void;
  
  // Menu actions
  setActiveMenu: (menu: string) => void;
  
  // Error handling
  setGlobalError: (error: string | null) => void;
  clearGlobalError: () => void;
  
  // Theme actions
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;
}

export const useAppStore = create<AppState & AppActions>((set, get) => ({
  // State
  sidebarOpen: true,
  isMobile: false,
  loading: false,
  modals: {},
  activeMenu: 'home',
  globalError: null,
  theme: 'light',

  // Actions
  toggleSidebar: () => {
    set((state) => ({ sidebarOpen: !state.sidebarOpen }));
  },

  setSidebarOpen: (open) => {
    set({ sidebarOpen: open });
  },

  setIsMobile: (isMobile) => {
    set({ isMobile });
    // Auto close sidebar on mobile
    if (isMobile) {
      set({ sidebarOpen: false });
    }
  },

  setLoading: (loading) => {
    set({ loading });
  },

  openModal: (modalKey) => {
    set((state) => ({
      modals: {
        ...state.modals,
        [modalKey]: true
      }
    }));
  },

  closeModal: (modalKey) => {
    set((state) => ({
      modals: {
        ...state.modals,
        [modalKey]: false
      }
    }));
  },

  closeAllModals: () => {
    set({ modals: {} });
  },

  setActiveMenu: (menu) => {
    set({ activeMenu: menu });
  },

  setGlobalError: (error) => {
    set({ globalError: error });
  },

  clearGlobalError: () => {
    set({ globalError: null });
  },

  setTheme: (theme) => {
    set({ theme });
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', theme);
      document.documentElement.classList.toggle('dark', theme === 'dark');
    }
  },

  toggleTheme: () => {
    const currentTheme = get().theme;
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    get().setTheme(newTheme);
  }
})); 