import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import { login as authLogin } from '@/services/auth/login';
import { API_BASE_URL_AUTH } from '@/constants/apiKey';

interface User {
  id: string;
  username: string;
  role: string;
  name?: string;
}

interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface AuthActions {
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
  clearError: () => void;
  checkAuth: () => void;
  setUserRole: (role: string) => void;
}

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set, get) => ({
      // State
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,
      error: null,

      // Actions
      login: async (credentials) => {
        set({ loading: true, error: null });
        try {
          // Use the existing auth service instead of non-existent API endpoint
          const data = await authLogin({
            username: credentials.username,
            password: credentials.password
          });
          
          const token = data.token;
          
          // Try to decode JWT if it's a JWT token
          let user: User;
          try {
            const decoded: any = jwtDecode(token);
            user = {
              id: decoded.id || decoded.userId || credentials.username,
              username: decoded.username || credentials.username,
              role: decoded.role || 'user',
              name: decoded.name || credentials.username,
            };
          } catch (decodeError) {
            // If token is not JWT, create user from credentials
            user = {
              id: credentials.username,
              username: credentials.username,
              role: 'user',
              name: credentials.username,
            };
          }

          // Token is already stored by the auth service
          // But also store in our format for consistency
          Cookies.set('token', token, { expires: 7 });
          // Make sure __sessionId is set for middleware
          Cookies.set('__sessionId', token, { expires: 3, secure: false, sameSite: 'strict' });

          set({ 
            user, 
            token, 
            isAuthenticated: true,
            loading: false,
            error: null
          });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Login failed';
          set({ 
            error: errorMessage, 
            loading: false,
            isAuthenticated: false
          });
          throw error;
        }
      },

      logout: () => {
        // Clear all possible token storage locations
        Cookies.remove('token');
        Cookies.remove('__sessionId');
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        
        set({ 
          user: null, 
          token: null, 
          isAuthenticated: false,
          error: null 
        });

        // Redirect to login
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      },

      refreshToken: async () => {
        const currentToken = get().token;
        if (!currentToken) return;

        try {
          const response = await fetch(`${API_BASE_URL_AUTH}/refresh`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${currentToken}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            const newToken = data.token;
            
            let user: User;
            try {
              const decoded: any = jwtDecode(newToken);
              user = {
                id: decoded.id || decoded.userId,
                username: decoded.username,
                role: decoded.role,
                name: decoded.name,
              };
            } catch (decodeError) {
              // Keep existing user if decode fails
              user = get().user!;
            }

            Cookies.set('token', newToken, { expires: 7 });
            Cookies.set('__sessionId', newToken, { expires: 3, secure: false, sameSite: 'strict' });
            localStorage.setItem('token', newToken);
            
            set({ token: newToken, user });
          }
        } catch (error) {
          console.error('Token refresh failed:', error);
          get().logout();
        }
      },

      clearError: () => set({ error: null }),

      checkAuth: () => {
        // Check multiple token storage locations
        const token = Cookies.get('token') || Cookies.get('__sessionId') || localStorage.getItem('token');
        
        if (token) {
          try {
            const decoded: any = jwtDecode(token);
            const user: User = {
              id: decoded.id || decoded.userId,
              username: decoded.username,
              role: decoded.role,
              name: decoded.name,
            };
            
            set({ 
              user, 
              token, 
              isAuthenticated: true 
            });
          } catch (error) {
            // If JWT decode fails, try to create user from stored data
            const storedUser = get().user;
            if (storedUser && token) {
              set({ 
                user: storedUser, 
                token, 
                isAuthenticated: true 
              });
            } else {
              console.error('Invalid token:', error);
              get().logout();
            }
          }
        }
      },

      setUserRole: (role: string) => {
        const currentUser = get().user;
        if (currentUser) {
          set({ 
            user: { ...currentUser, role }
          });
        }
      }
    }),
    {
      name: 'auth-store',
      partialize: (state) => ({ 
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated
      }),
    }
  )
); 