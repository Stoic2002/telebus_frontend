import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuthStore, useAppStore } from '@/store';
import { Loading } from '@/components/ui/loading';

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const { checkAuth, isAuthenticated, loading } = useAuthStore();
  const { setIsMobile } = useAppStore();

  // Initialize auth check
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Handle mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [setIsMobile]);

  // Handle route protection
  useEffect(() => {
    const publicRoutes = ['/login', '/'];
    const isPublicRoute = publicRoutes.includes(router.pathname);
    
    if (!loading) {
      // Only handle root path redirect - middleware handles login/dashboard protection
      if (isAuthenticated && router.pathname === '/') {
        router.push('/dashboard/home');
      }
      // Also handle login page redirect if user is already authenticated
      else if (isAuthenticated && router.pathname === '/login') {
        router.push('/dashboard/home');
      }
    }
  }, [isAuthenticated, loading, router]);

  // Show loading screen while checking auth
  if (loading) {
    return <Loading fullScreen text="Loading..." />;
  }

  return <Component {...pageProps} />;
}
