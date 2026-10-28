-- Run this once in the Supabase SQL Editor for the Garud Automobiles site.
-- Public visitors can read vehicle listings. Only authenticated server routes write.

create table if not exists public.vehicle_catalog (
  id text primary key,
  data jsonb,
  is_deleted boolean not null default false,
  updated_at timestamptz not null default now()
);

alter table public.vehicle_catalog enable row level security;
grant select on table public.vehicle_catalog to anon, authenticated;

drop policy if exists "Public can read vehicle catalogue" on public.vehicle_catalog;
create policy "Public can read vehicle catalogue"
  on public.vehicle_catalog for select to anon, authenticated using (true);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('vehicle-images', 'vehicle-images', true, 5242880, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update set public = excluded.public, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

-- No anonymous write policy is created. The server uses its secret key after admin-session validation.
