import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function middleware(req) {
  const token = cookies().get('auth_token');

  if (token && req.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/minutes', req.url));
  }

  if (!token && req.nextUrl.pathname !== '/') {
    return NextResponse.redirect(new URL('/', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/minutes'],
};