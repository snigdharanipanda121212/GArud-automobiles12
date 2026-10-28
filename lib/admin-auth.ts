import { createHmac, timingSafeEqual } from 'node:crypto';

export const ADMIN_COOKIE_NAME = 'garud_admin_session';
const SESSION_SECONDS = 60 * 60 * 8;

function getSessionSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) throw new Error('ADMIN_SESSION_SECRET is not configured');
  return secret;
}

function sign(expires: string) {
  return createHmac('sha256', getSessionSecret()).update(expires).digest('base64url');
}

export function createAdminSession() {
  const expires = String(Math.floor(Date.now() / 1000) + SESSION_SECONDS);
  return { value: `${expires}.${sign(expires)}`, maxAge: SESSION_SECONDS };
}

export function verifyAdminSession(value?: string | null) {
  if (!value) return false;
  const [expires, signature] = value.split('.');
  const expiry = Number(expires);
  if (!expires || !signature || !Number.isFinite(expiry) || expiry <= Math.floor(Date.now() / 1000)) return false;
  try {
    const expected = Buffer.from(sign(expires));
    const supplied = Buffer.from(signature);
    return expected.length === supplied.length && timingSafeEqual(expected, supplied);
  } catch {
    return false;
  }
}

export const adminCookieOptions = (maxAge: number) => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
  maxAge,
});
