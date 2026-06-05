-- Create posts table
create table if not exists public.posts (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  content text not null default '',
  excerpt text,
  slug text not null unique,
  is_premium boolean not null default false,
  published boolean not null default true,
  user_id uuid references auth.users(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Index for slug lookups
create index posts_slug_idx on public.posts(slug);
create index posts_user_id_idx on public.posts(user_id);

-- Enable RLS
alter table public.posts enable row level security;

-- Public posts are readable by everyone
create policy "Public posts are viewable by everyone"
  on public.posts for select
  using (published = true);

-- Users can manage their own posts
create policy "Users can insert their own posts"
  on public.posts for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own posts"
  on public.posts for update
  using (auth.uid() = user_id);

create policy "Users can delete their own posts"
  on public.posts for delete
  using (auth.uid() = user_id);

-- Auto-update updated_at
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger on_post_updated
  before update on public.posts
  for each row execute procedure public.handle_updated_at();