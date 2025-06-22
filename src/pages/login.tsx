import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useAuthStore } from '@/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loading } from '@/components/ui/loading';
import Image from 'next/image';
import { IoLockClosedOutline, IoPersonOutline, IoEyeOutline, IoEyeOffOutline } from 'react-icons/io5';

const LoginPage = () => {
  const router = useRouter();
  const { login, loading, error, clearError } = useAuthStore();
  
  // Local form state (UI state only)
  const [formData, setFormData] = useState({ 
    username: '', 
    password: '' 
  });
  
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (error) {
      clearError();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.username.trim() || !formData.password.trim()) {
      return;
    }

    try {
      await login(formData);
      // Navigate to dashboard after successful login
      router.push('/dashboard/home');
    } catch (err) {
      // Error is handled by the store
      console.error('Login failed:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-slate-800 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('/assets/plta-mrica.jpeg')] bg-cover bg-center"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/90 to-slate-900/90"></div>
      </div>
      
      {/* Decorative Elements */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-blue-500/20 rounded-full blur-xl"></div>
      <div className="absolute bottom-20 right-20 w-40 h-40 bg-cyan-500/20 rounded-full blur-xl"></div>
      <div className="absolute top-1/2 left-10 w-24 h-24 bg-white/10 rounded-full blur-lg"></div>
      
      {/* Logo at top-left corner */}
      <div className="absolute top-6 left-6 z-20 space-y-3">
        {/* PLN Logo */}
        <div className="w-48 h-20 bg-blue-600/20 backdrop-blur-md border border-white/20 rounded-xl p-3 shadow-lg">
          <Image
            src="/assets/ip-mrica-logo.png"
            alt="IP Mrica Logo"
            width={100}
            height={100}
            className="w-full h-full object-contain"
          />
        </div>
        
        {/* Telebus Logo */}
        <div className="relative w-48 h-16">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 rounded-xl blur-sm opacity-70"></div>
          <div className="relative w-full h-full bg-white backdrop-blur-md border-2 border-blue-300/60 rounded-xl p-3 shadow-xl ring-1 ring-blue-200/30">
            <Image
              src="/assets/tele-bus.png"
              alt="Telebus Logo"
              width={100}
              height={80}
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      </div>
      
      <div className="w-full max-w-md relative z-10">
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 overflow-hidden login-card-glow animate-slide-in">
          {/* Form Section */}
          <div className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Welcome Back
              </h2>
              <p className="text-gray-600">
                Please sign in to access the monitoring system
              </p>
            </div>

            {/* Error Alert */}
            {error && (
              <Alert className="mb-6 bg-red-50 border-red-200 text-red-800">
                <AlertDescription className="flex items-center">
                  <IoLockClosedOutline className="w-4 h-4 mr-2" />
                  {error}
                </AlertDescription>
              </Alert>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-medium text-gray-700">
                  Username
                </Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <IoPersonOutline className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    id="username"
                    name="username"
                    type="text"
                    required
                    className="pl-10 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg login-input-focus"
                    placeholder="Enter your username"
                    value={formData.username}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Password
                </Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <IoLockClosedOutline className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    className="pl-10 pr-12 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg login-input-focus"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <IoEyeOffOutline className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <IoEyeOutline className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg shadow-lg transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:transform-none login-button-hover"
                disabled={loading || !formData.username.trim() || !formData.password.trim()}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <Loading size="sm" className="mr-2" />
                    Signing in...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <IoLockClosedOutline className="w-5 h-5 mr-2" />
                    Sign In
                  </div>
                )}
              </Button>
            </form>
          </div>

          {/* Footer */}
          <div className="px-8 pb-8">
            <div className="border-t border-gray-200 pt-6 text-center">
              <p className="text-xs text-gray-500 mb-2">
                © 2024 PLN Indonesia Power - PLTA Mrica
              </p>
              <p className="text-xs text-gray-400">
                Need help? Contact system administrator
              </p>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-6 text-center">
          <p className="text-white/80 text-sm">
            Telemetering & Monitoring System
          </p>
          <p className="text-white/60 text-xs mt-1">
            Secure access to real-time power plant data
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;