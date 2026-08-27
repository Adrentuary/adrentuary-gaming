-- ════════════════════════════════════════════════════
--  Adrentuary Gaming — Supabase Database Setup
--  Run this in: Supabase Dashboard → SQL Editor → New query
-- ════════════════════════════════════════════════════

-- 1. PROFILES TABLE
-- Stores public user info linked to auth.users
create table if not exists public.profiles (
  id            uuid primary key references auth.users(id) on delete cascade,
  username      text unique,
  display_name  text,
  avatar_url    text,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

-- Row Level Security: users can only read/write their own profile
alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);


-- 2. GUIDE PROGRESS TABLE
-- Stores arbitrary JSON progress per user per guide
create table if not exists public.guide_progress (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  guide_id   text not null,
  progress   jsonb not null default '{}',
  updated_at timestamptz default now(),
  unique(user_id, guide_id)
);

alter table public.guide_progress enable row level security;

create policy "Users can manage own guide progress"
  on public.guide_progress for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);


-- 3. AUTO-CREATE PROFILE ON SIGNUP
-- Trigger that fires when a new user registers
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1))
  )
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- 4. AVATARS STORAGE BUCKET
-- Creates a public bucket for user avatar images
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

-- Storage policy: users can upload/update their own avatar
create policy "Avatar upload for owner"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);

create policy "Avatar update for owner"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Anyone can read avatars (they're public)
create policy "Public avatar read"
  on storage.objects for select
  using (bucket_id = 'avatars');
