-- Migration: Add image columns, create storage bucket, set up storage and database insert policies

-- 1. Add front_image_url and back_image_url to scans table
alter table public.scans 
add column if not exists front_image_url text,
add column if not exists back_image_url text;

-- 2. Add INSERT RLS policies for profiles, subscriptions, and price_results
drop policy if exists "Users can insert own profile" on public.profiles;
create policy "Users can insert own profile" 
on public.profiles for insert 
with check (auth.uid() = id);

drop policy if exists "Users can insert own subscription" on public.subscriptions;
create policy "Users can insert own subscription" 
on public.subscriptions for insert 
with check (auth.uid() = user_id);

drop policy if exists "Users can insert price results for own scans" on public.price_results;
create policy "Users can insert price results for own scans" 
on public.price_results for insert 
with check (
  exists (select 1 from public.scans where scans.id = price_results.scan_id and scans.user_id = auth.uid())
);

-- 3. Create 'scans' storage bucket if it does not exist
insert into storage.buckets (id, name, public)
values ('scans', 'scans', true)
on conflict (id) do nothing;

-- 4. Set up storage policies for the 'scans' bucket
-- Allow public select
drop policy if exists "Public Access" on storage.objects;
create policy "Public Access"
on storage.objects for select
using ( bucket_id = 'scans' );

-- Allow authenticated uploads
drop policy if exists "Authenticated Upload" on storage.objects;
create policy "Authenticated Upload"
on storage.objects for insert
with check (
  bucket_id = 'scans' 
  and auth.role() = 'authenticated'
);

-- Allow authenticated deletions
drop policy if exists "Authenticated Owner Delete" on storage.objects;
create policy "Authenticated Owner Delete"
on storage.objects for delete
using (
  bucket_id = 'scans'
  and auth.role() = 'authenticated'
);
