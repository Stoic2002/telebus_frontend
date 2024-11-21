// import axios from 'axios';
// import { LoginData, LoginResponse } from '../../types/userTypes';
// import { API_BASE_URL_AUTH } from '@/constants/apiKey';

// // axios.defaults.headers.common['ngrok-skip-browser-warning'] = 'true';

// export const login = async (loginData: LoginData): Promise<LoginResponse> => {
//   try {
//     const response = await axios.post<LoginResponse>(
//       `${API_BASE_URL_AUTH}/login`, 
//       loginData,
//       {
//         withCredentials: true,
//         headers: {
//           'Content-Type': 'application/json',
//         }
//       }
//     );
//     return response.data;
//   } catch (error) {
//     if (axios.isAxiosError(error)) {
//       console.error('Login failed:', error.response?.data || error.message);
//       throw new Error(error.response?.data?.message || 'Login failed. Please check your credentials and try again.');
//     }
//     throw error;
//   }
// };

import { LoginData, LoginResponse } from '../../types/userTypes';
import { API_BASE_URL_AUTH } from '@/constants/apiKey';

export const login = async (loginData: LoginData): Promise<LoginResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL_AUTH}/login`, {
      method: 'POST',
      // credentials: 'include', // Untuk mengirim cookie (setara dengan `withCredentials: true` di Axios)
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData), // Konversi objek loginData ke JSON
    });

    if (!response.ok) {
      // Jika status HTTP tidak OK, lemparkan error
      const errorData = await response.json();
      throw new Error(errorData.message || 'Login failed. Please check your credentials and try again.');
    }

    // Parsing respons menjadi LoginResponse
    const data: LoginResponse = await response.json();
    return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Login failed:', error.message);
      throw new Error(error.message);
    }
    throw error;
  }
};
