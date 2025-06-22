import { apiClient } from './client';

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    username: string;
    role: string;
    name?: string;
  };
}

export interface RefreshTokenResponse {
  token: string;
}

export const authAPI = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await apiClient.post('/api/auth/login', credentials);
    return response.data;
  },

  logout: async (): Promise<void> => {
    await apiClient.post('/api/auth/logout');
  },

  refreshToken: async (): Promise<RefreshTokenResponse> => {
    const response = await apiClient.post('/api/auth/refresh');
    return response.data;
  },

  verifyToken: async (token: string): Promise<boolean> => {
    try {
      await apiClient.get('/api/auth/verify', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return true;
    } catch {
      return false;
    }
  }
}; 