import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { ADMIN_COOKIE_NAME, adminCookieOptions, verifyAdminSession } from '@/lib/admin-auth';

export async function GET() {
  const cookieStore = await cookies();
  const authenticated = verifyAdminSession(cookieStore.get(ADMIN_COOKIE_NAME)?.value);
  return NextResponse.json({ authenticated });
}

export async function POST() {
  const response = NextResponse.json({ success: true });
  response.cookies.set(ADMIN_COOKIE_NAME, '', adminCookieOptions(0));
  return response;
}
