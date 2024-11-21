import Cookies from 'js-cookie';
import { API_BASE_URL_AUTH } from '@/constants/apiKey';

export const logout = async () => {
  const token = Cookies.get('__sessionId');

  if (!token) {
    console.warn('No session token found.');
    throw new Error('No active session to log out.');
  }

  try {
    const response = await fetch(`${API_BASE_URL_AUTH}/logout`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log('token :', token);
    console.log('Response Status:', response.status);
    console.log('Response Headers:', response.headers);
  
    if (!response.ok) {
      const contentType = response.headers.get('Content-Type');
      console.log('Content-Type:', contentType);
  
      if (contentType && contentType.includes('application/json')) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Logout failed.');
      } else {
        throw new Error(`Logout failed with status ${response.status}: ${response.statusText}`);
      }
    }
  
    Cookies.remove('__sessionId');
    localStorage.removeItem('token');
  } catch (error: unknown) {
    console.error('Logout Error:', error);
    throw error;
  }
  
};
