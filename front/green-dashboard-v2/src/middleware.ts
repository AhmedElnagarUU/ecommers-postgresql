import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import authService from '@/features/auth/api/auth.api';


export async function middleware(request: NextRequest) {}
// export async function middleware(request: NextRequest) {
//   const isAuthed = await authService.validateAuth();
//   if(isAuthed) {
//     return NextResponse.redirect(new URL('/dashboard', request.url));
//   }
//   return NextResponse.redirect(new URL('/login', request.url));
// }


// export function middleware(request: NextRequest) {
//   const sessionCookie = request.cookies.get(AUTH_COOKIE)?.value;
//   const hasSession = isLikelyValidSessionCookie(sessionCookie);
//   const { pathname } = request.nextUrl;
//   const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/register');
//   const isDashboard = pathname.startsWith('/dashboard');

//   if (isAuthPage && hasSession) {
//     return NextResponse.redirect(new URL('/dashboard', request.url));
//   }

//   if (isDashboard && !hasSession) {
//     const response = NextResponse.redirect(new URL('/login', request.url));
//     if (sessionCookie) {
//       response.cookies.delete(AUTH_COOKIE);
//     }
//     return response;
//   }

//   const response = NextResponse.next();
//   if (!hasSession && sessionCookie) {
//     response.cookies.delete(AUTH_COOKIE);
//   }
//   return response;
// }

// export const config = {
//   matcher: ['/dashboard/:path*', '/login', '/register'],
// };
