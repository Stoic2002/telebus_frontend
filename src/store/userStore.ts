import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { fetchWithRetry } from '@/hooks/fetchWithRetry';
import { API_BASE_URL_AUTH } from '@/constants/apiKey';

interface User {
  _id?: string;
  username: string;
  password?: string;
  role: 'client' | 'opr' | 'ghw' | 'admin';
  created_at?: string;
  updated_at?: string;
}

interface NewUser {
  username: string;
  password: string;
  role: 'client' | 'opr' | 'ghw' | 'admin';
}

export interface UserState {
  users: User[];
  selectedUser: User | null;
  newUser: NewUser;
  loading: boolean;
  error: string | null;
  searchQuery: string;
  // Alert state for user actions
  alert: {
    show: boolean;
    message: string;
    type: 'success' | 'error' | 'info';
  };
}

export interface UserActions {
  // User CRUD operations
  fetchUsers: () => Promise<void>;
  createUser: (userData: NewUser) => Promise<void>;
  updateUser: (id: string, data: Partial<User>) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  searchUsers: (query: string) => Promise<void>;
  
  // Selection
  selectUser: (user: User | null) => void;
  
  // Form management
  setNewUser: (user: Partial<NewUser>) => void;
  clearNewUser: () => void;
  
  // Search
  setSearchQuery: (query: string) => void;
  clearUsers: () => void;
  
  // Alert management
  showAlert: (message: string, type: 'success' | 'error' | 'info') => void;
  hideAlert: () => void;
  
  // Error handling
  clearError: () => void;
  
  // Reset state
  reset: () => void;
}

export const useUserStore = create<UserState & UserActions>()(
  persist(
    (set, get) => ({
      // State
      users: [],
      selectedUser: null,
      newUser: {
        username: '',
        password: '',
        role: 'client'
      },
      loading: false,
      error: null,
      searchQuery: '',
      alert: {
        show: false,
        message: '',
        type: 'info'
      },

      // Actions
      fetchUsers: async () => {
        set({ loading: true, error: null });
        try {
          const response = await fetchWithRetry(
            () => fetch(`${API_BASE_URL_AUTH}/users`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
            }),
            3, // max attempts
            1000 // delay in ms
          );

          if (!response.ok) {
            throw new Error('Failed to fetch users');
          }

          const users = await response.json();
          set({ users, loading: false });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to fetch users';
          set({ error: errorMessage, loading: false });
        }
      },

      createUser: async (userData) => {
        set({ loading: true, error: null });
        try {
          const response = await fetchWithRetry(
            () => fetch(`${API_BASE_URL_AUTH}/users`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(userData),
            }),
            3, // max attempts
            1000 // delay in ms
          );

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to create user');
          }

          const newUser = await response.json();
          set((state) => ({
            users: [...state.users, newUser],
            loading: false,
            newUser: { username: '', password: '', role: 'client' } // Reset form
          }));

          get().showAlert('User berhasil dibuat', 'success');
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to create user';
          set({ error: errorMessage, loading: false });
          get().showAlert(errorMessage, 'error');
        }
      },

      updateUser: async (id, data) => {
        set({ loading: true, error: null });
        try {
          const response = await fetchWithRetry(
            () => fetch(`${API_BASE_URL_AUTH}/users/${id}`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(data),
            }),
            3, // max attempts
            1000 // delay in ms
          );

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to update user');
          }

          const updatedUser = await response.json();
          set((state) => ({
            users: state.users.map(user => 
              user._id === id ? updatedUser : user
            ),
            loading: false
          }));

          get().showAlert('User berhasil diperbarui', 'success');
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to update user';
          set({ error: errorMessage, loading: false });
          get().showAlert(errorMessage, 'error');
        }
      },

      deleteUser: async (id) => {
        set({ loading: true, error: null });
        try {
          const response = await fetchWithRetry(
            () => fetch(`${API_BASE_URL_AUTH}/users/${id}`, {
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json',
              },
            }),
            3, // max attempts
            1000 // delay in ms
          );

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to delete user');
          }

          set((state) => ({
            users: state.users.filter(user => user._id !== id),
            selectedUser: state.selectedUser?._id === id ? null : state.selectedUser,
            loading: false
          }));

          get().showAlert('User berhasil dihapus', 'success');
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to delete user';
          set({ error: errorMessage, loading: false });
          get().showAlert(errorMessage, 'error');
        }
      },

      searchUsers: async (query) => {
        set({ loading: true, error: null, searchQuery: query });
        try {
          const response = await fetchWithRetry(
            () => fetch(`${API_BASE_URL_AUTH}/users/search?q=${encodeURIComponent(query)}`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
            }),
            3, // max attempts
            1000 // delay in ms
          );

          if (!response.ok) {
            throw new Error('Search failed');
          }

          const users = await response.json();
          set({ users, loading: false });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Search failed';
          set({ error: errorMessage, loading: false });
        }
      },

      selectUser: (user) => {
        set({ selectedUser: user });
      },

      setNewUser: (userData) => {
        set((state) => ({
          newUser: { ...state.newUser, ...userData }
        }));
      },

      clearNewUser: () => {
        set({
          newUser: {
            username: '',
            password: '',
            role: 'client'
          }
        });
      },

      setSearchQuery: (query) => {
        set({ searchQuery: query });
      },

      clearUsers: () => {
        set({ users: [] });
      },

      showAlert: (message, type) => {
        set({
          alert: {
            show: true,
            message,
            type
          }
        });

        // Auto hide after 5 seconds
        setTimeout(() => {
          get().hideAlert();
        }, 5000);
      },

      hideAlert: () => {
        set({
          alert: {
            show: false,
            message: '',
            type: 'info'
          }
        });
      },

      clearError: () => {
        set({ error: null });
      },

      reset: () => {
        set({
          users: [],
          selectedUser: null,
          newUser: {
            username: '',
            password: '',
            role: 'client'
          },
          loading: false,
          error: null,
          searchQuery: '',
          alert: {
            show: false,
            message: '',
            type: 'info'
          }
        });
      }
    }),
    {
      name: 'user-store',
      partialize: (state) => ({ 
        selectedUser: state.selectedUser,
        searchQuery: state.searchQuery
      }),
    }
  )
); 