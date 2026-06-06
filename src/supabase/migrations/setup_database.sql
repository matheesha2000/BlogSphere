-- ============================================================
-- BlogSphere — Database Setup (Safe / Idempotent)
-- Run this in: Supabase Dashboard → SQL Editor
-- Works whether tables already exist or not.
-- ============================================================


-- ── 001: profiles ───────────────────────────────────────────

create table if not exists public.profiles (
  id          uuid references auth.users(id) on delete cascade primary key,
  email       text not null,
  full_name   text,
  avatar_url  text,
  created_at  timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.profiles enable row level security;

drop policy if exists "Profiles are viewable by everyone"   on public.profiles;
drop policy if exists "Users can update their own profile"  on public.profiles;

create policy "Profiles are viewable by everyone"
  on public.profiles for select using (true);

create policy "Users can update their own profile"
  on public.profiles for update using (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name'
  )
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- ── 002: posts — create table if missing ────────────────────

create table if not exists public.posts (
  id          uuid default gen_random_uuid() primary key,
  title       text not null,
  content     text not null default '',
  excerpt     text,
  slug        text not null unique,
  is_premium  boolean not null default false,
  published   boolean not null default true,
  user_id     uuid references auth.users(id) on delete cascade not null,
  created_at  timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at  timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ── Add any missing columns to an existing posts table ───────
alter table public.posts add column if not exists excerpt     text;
alter table public.posts add column if not exists is_premium  boolean not null default false;
alter table public.posts add column if not exists published   boolean not null default true;
alter table public.posts add column if not exists user_id     uuid references auth.users(id) on delete cascade;
alter table public.posts add column if not exists updated_at  timestamp with time zone default timezone('utc'::text, now()) not null;

-- Mark all existing rows as published (if column was just added)
update public.posts set published = true  where published is null;
update public.posts set is_premium = false where is_premium is null;

create index if not exists posts_slug_idx    on public.posts(slug);
create index if not exists posts_user_id_idx on public.posts(user_id);

alter table public.posts enable row level security;

-- Recreate RLS policies
drop policy if exists "Public posts are viewable by everyone" on public.posts;
drop policy if exists "Users can insert their own posts"      on public.posts;
drop policy if exists "Users can update their own posts"      on public.posts;
drop policy if exists "Users can delete their own posts"      on public.posts;

create policy "Public posts are viewable by everyone"
  on public.posts for select
  using (published = true);

create policy "Users can insert their own posts"
  on public.posts for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own posts"
  on public.posts for update
  using (auth.uid() = user_id);

create policy "Users can delete their own posts"
  on public.posts for delete
  using (auth.uid() = user_id);

-- Also allow authenticated users to read their own unpublished drafts
drop policy if exists "Users can view their own drafts" on public.posts;
create policy "Users can view their own drafts"
  on public.posts for select
  using (auth.uid() = user_id);

-- Auto-update updated_at trigger
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists on_post_updated on public.posts;
create trigger on_post_updated
  before update on public.posts
  for each row execute procedure public.handle_updated_at();


-- ── 003: subscriptions ──────────────────────────────────────

create table if not exists public.subscriptions (
  id                     uuid default gen_random_uuid() primary key,
  user_id                uuid references auth.users(id) on delete cascade not null unique,
  stripe_customer_id     text unique,
  stripe_subscription_id text unique,
  status                 text check (status in ('active', 'canceled', 'past_due', 'trialing', 'incomplete')),
  price_id               text,
  current_period_end     timestamp with time zone,
  created_at             timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.subscriptions enable row level security;

drop policy if exists "Users can view their own subscription" on public.subscriptions;
create policy "Users can view their own subscription"
  on public.subscriptions for select
  using (auth.uid() = user_id);


-- ── Done ────────────────────────────────────────────────────
-- Verify with: SELECT column_name FROM information_schema.columns WHERE table_name = 'posts';
