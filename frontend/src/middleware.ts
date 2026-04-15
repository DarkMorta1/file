import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname;

  // If it's not an admin path, don't do anything
  if (!path.startsWith('/admin')) {
    return NextResponse.next();
  }

  // Check if the user is trying to access the login page
  const isLoginPage = path === '/admin/login';

  // Get the token from the request cookies
  const token = request.cookies.get('token')?.value;

  // If there's no token and this isn't the login page, redirect to login
  if (!token && !isLoginPage) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  // If there's a token and this is the login page, redirect to dashboard
  if (token && isLoginPage) {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/admin/:path*',
};