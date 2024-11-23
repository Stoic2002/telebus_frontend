import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { login } from '../services/auth/login';
import Cookies from 'js-cookie';

const Login = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await login(formData);
      console.log('Login successful:', response);
      router.push('/dashboard');
    } catch (error) {
      setError('Invalid email or password.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-login">
      <div className="absolute top-4 left-4">
        <img src="/assets/ip-mrica-logo.png" alt="Logo" className="h-16" />
      </div>
      <div className="relative bg-white shadow-lg rounded-2xl p-8 max-w-md w-full mx-4 sm:mx-auto">
        <div className="flex justify-center mb-6">
          <img src="/assets/tele-bus.png" alt="Logo" className="h-16 w-auto sm:h-15" />
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-800 font-semibold mb-2">User</label>
            <input
              type="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 bg-gray-100"
              required
            />
          </div>
          <div>
            <label className="block text-gray-800 font-semibold mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 bg-gray-100"
              required
            />
          </div>
          {error && <p className="text-red-600">{error}</p>}
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
            Log In
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;