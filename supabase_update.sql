-- Run this in Supabase SQL Editor before deploying v0.17.
-- Safe to run if your tables already exist.

create table if not exists profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  username text unique not null,
  phone_number text unique,
  created_at timestamptz default now()
);

create table if not exists game_scores (
  id bigint generated always as identity primary key,
  user_id uuid references profiles(id) on delete cascade,
  score integer not null,
  guesses_used integer not null default 6,
  respins_used integer not null default 0,
  completed boolean default true,
  mode text default 'Everyday',
  score_tier text,
  game_data jsonb,
  created_at timestamptz default now()
);

alter table game_scores
add column if not exists mode text default 'Everyday',
add column if not exists score_tier text,
add column if not exists game_data jsonb,
add column if not exists created_at timestamptz default now(),
add column if not exists completed boolean default true,
add column if not exists guesses_used integer default 6,
add column if not exists respins_used integer default 0;

alter table profiles enable row level security;
alter table game_scores enable row level security;

do $$
begin
  if not exists (select 1 from pg_policies where tablename = 'profiles' and policyname = 'Public profiles are viewable') then
    create policy "Public profiles are viewable" on profiles for select using (true);
  end if;

  if not exists (select 1 from pg_policies where tablename = 'profiles' and policyname = 'Users can insert their own profile') then
    create policy "Users can insert their own profile" on profiles for insert with check (auth.uid() = id);
  end if;

  if not exists (select 1 from pg_policies where tablename = 'profiles' and policyname = 'Users can update their own profile') then
    create policy "Users can update their own profile" on profiles for update using (auth.uid() = id) with check (auth.uid() = id);
  end if;

  if not exists (select 1 from pg_policies where tablename = 'game_scores' and policyname = 'Scores are publicly viewable') then
    create policy "Scores are publicly viewable" on game_scores for select using (true);
  end if;

  if not exists (select 1 from pg_policies where tablename = 'game_scores' and policyname = 'Users can insert their own scores') then
    create policy "Users can insert their own scores" on game_scores for insert with check (auth.uid() = user_id);
  end if;
end $$;
