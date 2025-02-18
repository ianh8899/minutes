import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(req) {
  const res = NextResponse.next();
  (await cookies()).delete('auth_token');
  console.log('Token removed');
  
  const APP_URL = process.env.APP_URL
  return NextResponse.redirect(APP_URL);
}