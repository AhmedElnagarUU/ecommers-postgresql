import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
//   const token = request.cookies.get('refreshToken')?.value;
//   const isAuthPage = request.nextUrl.pathname.startsWith('/login') || 
//                     request.nextUrl.pathname.startsWith('/register');

//   // If trying to access auth page while logged in, redirect to dashboard
//   if (isAuthPage && token) {
//     return NextResponse.redirect(new URL('/dashboard', request.url));
//   }

//   // If trying to access protected page while logged out, redirect to login
//   if (!isAuthPage && !token) {
//     return NextResponse.redirect(new URL('/login', request.url));
//   }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/login',
    '/register',
  ],
}; 