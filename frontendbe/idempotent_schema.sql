-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. PROFILES (Extends auth.users)
create table if not exists public.profiles (
  id uuid references auth.users not null primary key,
  full_name text,
  avatar_url text,
  email text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. USER SETTINGS
create table if not exists public.user_settings (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  theme text default 'system', -- 'light', 'dark', 'system'
  language text default 'en',
  default_scan_intent text default 'Verify', -- 'Verify', 'Price', 'Details'
  auto_save_history boolean default true,
  notifications_enabled boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id)
);

-- 3. SCANS
create table if not exists public.scans (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  input_type text not null, -- 'camera', 'upload', 'website'
  intent text not null, -- 'verify', 'price', 'details'
  image_url text,
  front_image_url text,
  back_image_url text,
  website_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. SCAN RESULTS
create table if not exists public.scan_results (
  id uuid default uuid_generate_v4() primary key,
  scan_id uuid references public.scans(id) on delete cascade not null,
  authenticity_status text, -- 'Genuine', 'Fake', 'Uncertain'
  confidence_score numeric,
  product_name text,
  brand text,
  metadata jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. PRICE RESULTS
create table if not exists public.price_results (
  id uuid default uuid_generate_v4() primary key,
  scan_id uuid references public.scans(id) on delete cascade not null,
  seller text,
  price numeric,
  currency text default 'USD',
  availability text, -- 'In Stock', 'Out of Stock'
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. SUPPORT TICKETS
create table if not exists public.support_tickets (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  subject text not null,
  message text not null,
  status text default 'open', -- 'open', 'in_progress', 'resolved'
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 7. FEEDBACK
create table if not exists public.feedback (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  rating integer check (rating >= 1 and rating <= 5),
  comment text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 8. SUBSCRIPTIONS
create table if not exists public.subscriptions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  plan text default 'free', -- 'free', 'pro', 'enterprise'
  status text default 'active', -- 'active', 'cancelled', 'expired'
  renewal_date timestamp with time zone,
  provider text, -- 'stripe', 'apple', 'google'
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id)
);

-- ROW LEVEL SECURITY (RLS) POLICIES
-- We drop existing policies to avoid "policy already exists" errors when re-running

-- PROFILES
alter table public.profiles enable row level security;
drop policy if exists "Users can view own profile" on public.profiles;
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

drop policy if exists "Users can insert own profile" on public.profiles;
create policy "Users can insert own profile" on public.profiles for insert with check (auth.uid() = id);

-- USER SETTINGS
alter table public.user_settings enable row level security;
drop policy if exists "Users can view own settings" on public.user_settings;
create policy "Users can view own settings" on public.user_settings for select using (auth.uid() = user_id);

drop policy if exists "Users can update own settings" on public.user_settings;
create policy "Users can update own settings" on public.user_settings for update using (auth.uid() = user_id);

drop policy if exists "Users can insert own settings" on public.user_settings;
create policy "Users can insert own settings" on public.user_settings for insert with check (auth.uid() = user_id);

-- SCANS
alter table public.scans enable row level security;
drop policy if exists "Users can view own scans" on public.scans;
create policy "Users can view own scans" on public.scans for select using (auth.uid() = user_id);

drop policy if exists "Users can insert own scans" on public.scans;
create policy "Users can insert own scans" on public.scans for insert with check (auth.uid() = user_id);

drop policy if exists "Users can delete own scans" on public.scans;
create policy "Users can delete own scans" on public.scans for delete using (auth.uid() = user_id);

-- SCAN RESULTS
alter table public.scan_results enable row level security;
drop policy if exists "Users can view results of own scans" on public.scan_results;
create policy "Users can view results of own scans" on public.scan_results for select using (
  exists (select 1 from public.scans where scans.id = scan_results.scan_id and scans.user_id = auth.uid())
);

drop policy if exists "Users can insert results for own scans" on public.scan_results;
create policy "Users can insert results for own scans" on public.scan_results for insert with check (
  exists (select 1 from public.scans where scans.id = scan_results.scan_id and scans.user_id = auth.uid())
);

-- PRICE RESULTS
alter table public.price_results enable row level security;
drop policy if exists "Users can view price results of own scans" on public.price_results;
create policy "Users can view price results of own scans" on public.price_results for select using (
  exists (select 1 from public.scans where scans.id = price_results.scan_id and scans.user_id = auth.uid())
);

drop policy if exists "Users can insert price results for own scans" on public.price_results;
create policy "Users can insert price results for own scans" on public.price_results for insert with check (
  exists (select 1 from public.scans where scans.id = price_results.scan_id and scans.user_id = auth.uid())
);

-- SUPPORT TICKETS
alter table public.support_tickets enable row level security;
drop policy if exists "Users can view own tickets" on public.support_tickets;
create policy "Users can view own tickets" on public.support_tickets for select using (auth.uid() = user_id);

drop policy if exists "Users can insert own tickets" on public.support_tickets;
create policy "Users can insert own tickets" on public.support_tickets for insert with check (auth.uid() = user_id);

-- FEEDBACK
alter table public.feedback enable row level security;
drop policy if exists "Users can insert feedback" on public.feedback;
create policy "Users can insert feedback" on public.feedback for insert with check (auth.uid() = user_id);

-- SUBSCRIPTIONS
alter table public.subscriptions enable row level security;
drop policy if exists "Users can view own subscription" on public.subscriptions;
create policy "Users can view own subscription" on public.subscriptions for select using (auth.uid() = user_id);

drop policy if exists "Users can insert own subscription" on public.subscriptions;
create policy "Users can insert own subscription" on public.subscriptions for insert with check (auth.uid() = user_id);

-- FUNCTIONS & TRIGGERS
-- Use 'create or replace' to handle existing functions safely
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url, email)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url', new.email)
  on conflict (id) do nothing; -- Handle if profile already exists
  
  insert into public.user_settings (user_id)
  values (new.id)
  on conflict (user_id) do nothing;
  
  insert into public.subscriptions (user_id)
  values (new.id)
  on conflict (user_id) do nothing;
  
  return new;
end;
$$ language plpgsql security definer;

-- Drop trigger if exists to avoid duplication error (Postgres doesn't support 'create or replace trigger')
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 9. STORAGE BUCKETS & POLICIES FOR SCANS
insert into storage.buckets (id, name, public)
values ('scans', 'scans', true)
on conflict (id) do nothing;

-- Enable policies on storage objects if they are not already
-- Allow public read access to 'scans' bucket
drop policy if exists "Public Access" on storage.objects;
create policy "Public Access"
on storage.objects for select
using ( bucket_id = 'scans' );

-- Allow authenticated upload to 'scans' bucket
drop policy if exists "Authenticated Upload" on storage.objects;
create policy "Authenticated Upload"
on storage.objects for insert
with check (
  bucket_id = 'scans' 
  and auth.role() = 'authenticated'
);

-- Allow authenticated deletion
drop policy if exists "Authenticated Owner Delete" on storage.objects;
create policy "Authenticated Owner Delete"
on storage.objects for delete
using (
  bucket_id = 'scans'
  and auth.role() = 'authenticated'
);

