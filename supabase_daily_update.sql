-- Run once before deploying v0.20.
-- Enforces one completed Daily Challenge score per user per calendar day.

create unique index if not exists one_daily_challenge_score_per_user_per_day
on game_scores (user_id, ((created_at at time zone 'UTC')::date))
where mode = 'Daily Challenge' and completed = true;
