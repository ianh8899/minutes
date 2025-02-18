import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import { sign } from 'jsonwebtoken';

export async function POST(req) {
  try {
    const { SUPABASE_URL, SUPABASE_SERVICE_KEY, RESEND_API_KEY, JWT_SECRET, APP_URL } = process.env;
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
    const resend = new Resend(RESEND_API_KEY);
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();
    let { data: user, error: lookupError } = await supabase
      .from('users')
      .select('*')
      .eq('email', normalizedEmail)
      .single();

    if (lookupError) {
      if (lookupError.code === 'PGRST116') {
        const { data: newUser, error: insertError } = await supabase
          .from('users')
          .insert([{ email: normalizedEmail }])
          .select('*')
          .single();

        if (insertError) {
          return NextResponse.json({ error: 'Error inserting user' }, { status: 500 });
        }

        user = newUser;
      } else {
        return NextResponse.json({ error: 'Error looking up user' }, { status: 500 });
      }
    }

    if (!user) {
      return NextResponse.json({ error: 'User not found and could not be created' }, { status: 500 });
    }

    const token = sign({ user: { id: user.id } }, JWT_SECRET, { expiresIn: '30d' });

    await resend.emails.send({
      from: 'Login <onboarding@resend.dev>',
      to: email,
      subject: 'Your login link',
      html: `<p>Click the link below to sign in:</p><a href="${APP_URL}/api/verify?token=${token}">Sign in to Your App</a>`,
    });

    return NextResponse.json({ message: 'Magic link sent' });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}