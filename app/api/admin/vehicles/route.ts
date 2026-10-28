import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_COOKIE_NAME, verifyAdminSession } from '@/lib/admin-auth';

const tableUrl = () => {
  const url = process.env.SUPABASE_URL?.replace(/\/$/, '');
  if (!url) throw new Error('SUPABASE_URL is not configured');
  return `${url}/rest/v1/vehicle_catalog`;
};

const serviceKey = () => {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY;
  if (!key) throw new Error('SUPABASE_SERVICE_ROLE_KEY is not configured');
  return key;
};

async function requireAdmin() {
  const cookieStore = await cookies();
  return verifyAdminSession(cookieStore.get(ADMIN_COOKIE_NAME)?.value);
}

export async function POST(request: NextRequest) {
  if (!(await requireAdmin())) return NextResponse.json({ error: 'Please sign in again.' }, { status: 401 });
  try {
    const vehicle = await request.json();
    if (!vehicle?.id || !vehicle?.name || !vehicle?.imageUrl) {
      return NextResponse.json({ error: 'Vehicle name and image are required.' }, { status: 400 });
    }
    const key = serviceKey();
    const response = await fetch(`${tableUrl()}?on_conflict=id`, {
      method: 'POST',
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
        Prefer: 'resolution=merge-duplicates,return=minimal',
      },
      body: JSON.stringify({ id: String(vehicle.id), data: vehicle, is_deleted: false, updated_at: new Date().toISOString() }),
      cache: 'no-store',
    });
    if (!response.ok) throw new Error(await response.text());
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to save shared vehicle:', error);
    return NextResponse.json({ error: 'Could not save the vehicle to the shared catalogue.' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  if (!(await requireAdmin())) return NextResponse.json({ error: 'Please sign in again.' }, { status: 401 });
  try {
    const { id } = await request.json();
    if (!id) return NextResponse.json({ error: 'Vehicle ID is required.' }, { status: 400 });
    const key = serviceKey();
    const response = await fetch(`${tableUrl()}?on_conflict=id`, {
      method: 'POST',
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
        Prefer: 'resolution=merge-duplicates,return=minimal',
      },
      body: JSON.stringify({ id: String(id), data: {}, is_deleted: true, updated_at: new Date().toISOString() }),
      cache: 'no-store',
    });
    if (!response.ok) throw new Error(await response.text());
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to remove shared vehicle:', error);
    return NextResponse.json({ error: 'Could not remove the vehicle from the shared catalogue.' }, { status: 500 });
  }
}
