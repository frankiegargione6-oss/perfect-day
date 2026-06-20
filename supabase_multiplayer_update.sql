-- Perfect Day v0.23 Multiplayer update
-- Run in Supabase SQL Editor before deploying v0.23.

create table if not exists group_matches (
  id bigint generated always as identity primary key,
  creator_id uuid references profiles(id) on delete cascade not null,
  mode text default 'Everyday',
  status text default 'active',
  winner_id uuid references profiles(id) on delete set null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists group_match_players (
  id bigint generated always as identity primary key,
  match_id bigint references group_matches(id) on delete cascade not null,
  user_id uuid references profiles(id) on delete cascade not null,
  score integer,
  game_data jsonb,
  finished_at timestamptz,
  created_at timestamptz default now(),
  unique(match_id, user_id)
);

create table if not exists team_matches (
  id bigint generated always as identity primary key,
  creator_id uuid references profiles(id) on delete cascade not null,
  mode text default 'Everyday',
  status text default 'active',
  team_a_score integer,
  team_b_score integer,
  winning_team text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists team_match_players (
  id bigint generated always as identity primary key,
  match_id bigint references team_matches(id) on delete cascade not null,
  user_id uuid references profiles(id) on delete cascade not null,
  team_name text not null check (team_name in ('A','B')),
  score integer,
  game_data jsonb,
  finished_at timestamptz,
  created_at timestamptz default now(),
  unique(match_id, user_id)
);

alter table group_matches enable row level security;
alter table group_match_players enable row level security;
alter table team_matches enable row level security;
alter table team_match_players enable row level security;

do $$
begin
  if not exists (select 1 from pg_policies where tablename = 'group_matches' and policyname = 'Group matches are viewable') then
    create policy "Group matches are viewable" on group_matches for select using (true);
  end if;
  if not exists (select 1 from pg_policies where tablename = 'group_matches' and policyname = 'Users create group matches') then
    create policy "Users create group matches" on group_matches for insert with check (auth.uid() = creator_id);
  end if;
  if not exists (select 1 from pg_policies where tablename = 'group_matches' and policyname = 'Players update group matches') then
    create policy "Players update group matches" on group_matches for update using (true) with check (true);
  end if;

  if not exists (select 1 from pg_policies where tablename = 'group_match_players' and policyname = 'Group players are viewable') then
    create policy "Group players are viewable" on group_match_players for select using (true);
  end if;
  if not exists (select 1 from pg_policies where tablename = 'group_match_players' and policyname = 'Users insert group players') then
    create policy "Users insert group players" on group_match_players for insert with check (true);
  end if;
  if not exists (select 1 from pg_policies where tablename = 'group_match_players' and policyname = 'Users update own group score') then
    create policy "Users update own group score" on group_match_players for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
  end if;

  if not exists (select 1 from pg_policies where tablename = 'team_matches' and policyname = 'Team matches are viewable') then
    create policy "Team matches are viewable" on team_matches for select using (true);
  end if;
  if not exists (select 1 from pg_policies where tablename = 'team_matches' and policyname = 'Users create team matches') then
    create policy "Users create team matches" on team_matches for insert with check (auth.uid() = creator_id);
  end if;
  if not exists (select 1 from pg_policies where tablename = 'team_matches' and policyname = 'Players update team matches') then
    create policy "Players update team matches" on team_matches for update using (true) with check (true);
  end if;

  if not exists (select 1 from pg_policies where tablename = 'team_match_players' and policyname = 'Team players are viewable') then
    create policy "Team players are viewable" on team_match_players for select using (true);
  end if;
  if not exists (select 1 from pg_policies where tablename = 'team_match_players' and policyname = 'Users insert team players') then
    create policy "Users insert team players" on team_match_players for insert with check (true);
  end if;
  if not exists (select 1 from pg_policies where tablename = 'team_match_players' and policyname = 'Users update own team score') then
    create policy "Users update own team score" on team_match_players for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
  end if;
end $$;
