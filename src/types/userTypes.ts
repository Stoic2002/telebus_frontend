export interface User {
    id: string;
    username: string;
    password: string;
    role: 'admin' | 'ghw' | 'opr' | 'client';
  }
  
  export interface LoginResponse {
    message:string;
    user: User;
    token: string;
    refreshToken:string
  }
  
  export interface LoginData {
    username: string;
    password: string;
  }