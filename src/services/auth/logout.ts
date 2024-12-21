import { API_BASE_URL_AUTH } from "@/constants/apiKey";
import { fetchWithRetry } from "@/hooks/fetchWithRetry";
import axios from "axios";
import Cookies from "js-cookie";
import { headers } from "next/headers";

export const logout = async () => {
  const token = Cookies.get('__sessionId');

  if (!token) {
    console.warn('No session token found.');
    throw new Error('No active session to log out.');
  }

  try {
     const response = await fetchWithRetry(
                              () => fetch(`${API_BASE_URL_AUTH}/logout`, {
                                method: 'POST',
                                headers: {
                                  Authorization: `Bearer ${token}`,
                                },
                              }),
                              3, // max attempts
                              1000 // delay in ms
                            );


    if (!response.ok) {
      const contentType = response.headers.get('Content-Type');
      if (contentType && contentType.includes('application/json')) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Logout failed.');
      } else {
        throw new Error(`Logout failed with status ${response.status}: ${response.statusText}`);
      }
    }

    Cookies.remove('__sessionId');
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken'); // Hapus refresh token saat logout
  } catch (error) {
    console.error('Logout Error:', error);
    throw error;
  }
};