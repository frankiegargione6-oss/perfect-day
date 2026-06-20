-- Run this once before deploying v0.25.
-- This adds a scoring-version marker so the public leaderboard can reset
-- while keeping older games visible in Past Games and profile totals.

alter table game_scores
add column if not exists scoring_version text;

-- Existing rows stay NULL/older season. New v0.25 games save as weighted_v1.
