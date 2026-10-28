-- Apply in the Supabase SQL Editor for the Garud Automobiles project.
-- Public visitors can read vehicle catalogue data and images; only the validated server admin can write.

create table if not exists public.vehicle_catalog (
  id text primary key,
  data jsonb not null,
  is_deleted boolean not null default false,
  updated_at timestamptz not null default now()
);

alter table public.vehicle_catalog enable row level security;
grant select on table public.vehicle_catalog to anon, authenticated;
drop policy if exists "Public can read shared vehicle catalogue" on public.vehicle_catalog;
create policy "Public can read shared vehicle catalogue"
  on public.vehicle_catalog for select to anon, authenticated using (true);

-- Existing vehicle records are product catalogue data.
grant select on table public.vehicles to anon, authenticated;
drop policy if exists "Public can read vehicle catalogue" on public.vehicles;
create policy "Public can read vehicle catalogue"
  on public.vehicles for select to anon, authenticated using (true);

-- Keep the existing catalogue image and use it for future site uploads.
update storage.buckets
set public = true,
    file_size_limit = 5242880,
    allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp']
where id = 'Snigdha Panda';

-- No anonymous insert, update, or delete policy is created.
