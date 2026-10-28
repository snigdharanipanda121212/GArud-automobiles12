import { randomUUID } from 'node:crypto';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_COOKIE_NAME, verifyAdminSession } from '@/lib/admin-auth';

export const runtime = 'nodejs';
const BUCKET = 'Snigdha Panda';
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

export async function POST(request: NextRequest) {
  const cookieStore = await cookies();
  if (!verifyAdminSession(cookieStore.get(ADMIN_COOKIE_NAME)?.value)) {
    return NextResponse.json({ error: 'Please sign in again.' }, { status: 401 });
  }

  try {
    const form = await request.formData();
    const file = form.get('file');
    if (!(file instanceof File)) return NextResponse.json({ error: 'Choose an image file.' }, { status: 400 });
    if (!ALLOWED_TYPES.has(file.type)) return NextResponse.json({ error: 'Use a JPG, PNG, or WebP image.' }, { status: 415 });
    if (file.size > MAX_FILE_SIZE) return NextResponse.json({ error: 'Image must be 5 MB or smaller.' }, { status: 413 });

    const supabaseUrl = process.env.SUPABASE_URL?.replace(/\/$/, '');
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY;
    if (!supabaseUrl || !key) throw new Error('Supabase server environment is not configured');

    const extension = file.type === 'image/jpeg' ? 'jpg' : file.type === 'image/png' ? 'png' : 'webp';
    const objectPath = `vehicles/${randomUUID()}.${extension}`;
    const encodedPath = objectPath.split('/').map(encodeURIComponent).join('/');
    const upload = await fetch(`${supabaseUrl}/storage/v1/object/${encodeURIComponent(BUCKET)}/${encodedPath}`, {
      method: 'POST',
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        'Content-Type': file.type,
        'cache-control': '31536000',
        'x-upsert': 'false',
      },
      body: file,
      cache: 'no-store',
    });
    if (!upload.ok) throw new Error(await upload.text());

    const imageUrl = `${supabaseUrl}/storage/v1/object/public/${encodeURIComponent(BUCKET)}/${encodedPath}`;
    return NextResponse.json({ imageUrl });
  } catch (error) {
    console.error('Failed to upload catalogue image:', error);
    return NextResponse.json({ error: 'Image upload failed. Please try again.' }, { status: 500 });
  }
}
