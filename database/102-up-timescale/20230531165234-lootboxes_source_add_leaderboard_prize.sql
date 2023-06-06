

-- migrate:up

-- for tagging rewards for top daily winners
ALTER TYPE lootbox_source ADD VALUE IF NOT EXISTS 'leaderboard_prize';

-- migrate:down
-- nothing here
