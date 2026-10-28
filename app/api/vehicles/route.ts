import { NextResponse } from 'next/server';
import { getVehicles } from '@/lib/store';

export const dynamic = 'force-dynamic';

export async function GET() {
  const supabaseUrl = process.env.SUPABASE_URL?.replace(/\/$/, '');
  const publicKey = process.env.SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_ANON_KEY;
  if (!supabaseUrl || !publicKey) {
    return NextResponse.json({ vehicles: getVehicles(), storageConfigured: false });
  }

  try {
    const response = await fetch(
      supabaseUrl + '/rest/v1/vehicle_catalog?select=id,data,is_deleted',
      { headers: { apikey: publicKey, Authorization: 'Bearer ' + publicKey }, cache: 'no-store' }
    );
    if (!response.ok) throw new Error('Catalogue read failed (' + response.status + ')');
    const rows = await response.json() as Array<{ id: string; data: unknown; is_deleted: boolean }>;
    const deletedIds = new Set(rows.filter(row => row.is_deleted).map(row => row.id));
    const savedVehicles = rows
      .filter(row => !row.is_deleted && row.data && typeof row.data === 'object')
      .map(row => row.data as ReturnType<typeof getVehicles>[number]);
    const vehicles = [
      ...getVehicles().filter(vehicle => !deletedIds.has(vehicle.id)),
      ...savedVehicles,
    ];
    return NextResponse.json({ vehicles, storageConfigured: true });
  } catch (error) {
    console.error('Failed to read shared vehicle catalogue:', error);
    return NextResponse.json({ error: 'The shared vehicle catalogue is temporarily unavailable.' }, { status: 503 });
  }
}
