import { NextResponse } from 'next/server';
import { setCookie } from 'cookies-next';

export async function GET(req) {
  try {
    const token = req.nextUrl.searchParams.get('token');

    if (!token) {
      console.log('No token provided');
      return NextResponse.json({ error: 'No token provided' }, { status: 400 });
    }

    const response = NextResponse.redirect(process.env.APP_URL);

    setCookie('auth_token', token, {
      req,
      res: response,
      httpOnly: true,
      secure: true,
      sameSite: 'Lax',
      path: '/',
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), // 30 days
    });

    console.log('Token set:', token);
    return response;
  } catch (error) {
    console.error('Error storing token:', error);
    return NextResponse.json({ error: 'Error storing token' }, { status: 500 });
  }
}