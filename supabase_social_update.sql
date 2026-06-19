-- Perfect Day v0.21 social update: friends + head-to-head.
-- Run in Supabase SQL Editor before deploying v0.21.

create table if not exists friend_requests (
  id bigint generated always as identity primary key,
  requester_id uuid references profiles(id) on delete cascade not null,
  receiver_id uuid references profiles(id) on delete cascade not null,
  status text not null default 'pending' check (status in ('pending','accepted','declined','cancelled')),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(requester_id, receiver_id)
);

create table if not exists friendships (
  id bigint generated always as identity primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  friend_id uuid references profiles(id) on delete cascade not null,
  created_at timestamptz default now(),
  unique(user_id, friend_id),
  check (user_id <> friend_id)
);

create table if not exists h2h_matches (
  id bigint generated always as identity primary key,
  challenger_id uuid references profiles(id) on delete cascade not null,
  opponent_id uuid references profiles(id) on delete cascade not null,
  mode text not null default 'Everyday',
  status text not null default 'pending' check (status in ('pending','accepted','completed','cancelled','declined')),
  challenger_score integer,
  opponent_score integer,
  challenger_game_data jsonb,
  opponent_game_data jsonb,
  winner_id uuid references profiles(id) on delete set null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table friend_requests enable row level security;
alter table friendships enable row level security;
alter table h2h_matches enable row level security;

do $$
begin
  if not exists (select 1 from pg_policies where tablename = 'friend_requests' and policyname = 'Users can view their friend requests') then
    create policy "Users can view their friend requests" on friend_requests for select using (auth.uid() = requester_id or auth.uid() = receiver_id);
  end if;
  if not exists (select 1 from pg_policies where tablename = 'friend_requests' and policyname = 'Users can send friend requests') then
    create policy "Users can send friend requests" on friend_requests for insert with check (auth.uid() = requester_id and requester_id <> receiver_id);
  end if;
  if not exists (select 1 from pg_policies where tablename = 'friend_requests' and policyname = 'Receivers can update friend requests') then
    create policy "Receivers can update friend requests" on friend_requests for update using (auth.uid() = receiver_id) with check (auth.uid() = receiver_id);
  end if;

  if not exists (select 1 from pg_policies where tablename = 'friendships' and policyname = 'Users can view their friendships') then
    create policy "Users can view their friendships" on friendships for select using (auth.uid() = user_id or auth.uid() = friend_id);
  end if;
  if not exists (select 1 from pg_policies where tablename = 'friendships' and policyname = 'Users can create friendships for themselves') then
    create policy "Users can create friendships for themselves" on friendships for insert with check (auth.uid() = user_id or auth.uid() = friend_id);
  end if;

  if not exists (select 1 from pg_policies where tablename = 'h2h_matches' and policyname = 'Users can view their h2h matches') then
    create policy "Users can view their h2h matches" on h2h_matches for select using (auth.uid() = challenger_id or auth.uid() = opponent_id);
  end if;
  if not exists (select 1 from pg_policies where tablename = 'h2h_matches' and policyname = 'Users can create h2h matches') then
    create policy "Users can create h2h matches" on h2h_matches for insert with check (auth.uid() = challenger_id and challenger_id <> opponent_id);
  end if;
  if not exists (select 1 from pg_policies where tablename = 'h2h_matches' and policyname = 'Players can update their h2h matches') then
    create policy "Players can update their h2h matches" on h2h_matches for update using (auth.uid() = challenger_id or auth.uid() = opponent_id) with check (auth.uid() = challenger_id or auth.uid() = opponent_id);
  end if;
end $$;
