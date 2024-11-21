import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('__sessionId');
  const res = NextResponse.next()
  // const local_token = localStorage.getItem('token');

  
  // Jika pengguna sudah login dan mencoba mengakses halaman login, arahkan ke /dashboard
  if (token && request.nextUrl.pathname === '/login') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }


  // Jika pengguna belum login dan mencoba mengakses halaman dashboard, arahkan ke /login
  if (!token && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return res; // Lanjutkan ke rute yang diinginkan
}

export const config = {
  matcher: ['/login', '/dashboard/:path*'], // Memproteksi halaman login dan dashboard
};
