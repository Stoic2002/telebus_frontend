import { API_BASE_URL_AUTH } from "@/constants/apiKey";
import { LoginData, LoginResponse } from "@/types/userTypes";
import Cookies from "js-cookie";

export const login = async (loginData: LoginData): Promise<LoginResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL_AUTH}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Login failed. Please check your credentials and try again.');
    }

    const data: LoginResponse = await response.json();
    // Simpan token dan refresh token jika ada
    Cookies.set('__sessionId', data.token, {expires: 3,secure:true, sameSite : 'lax'});
    localStorage.setItem('token', data.token);
    if (data.refreshToken) {
      localStorage.setItem('refreshToken', data.refreshToken);
    }
    return data;
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
};