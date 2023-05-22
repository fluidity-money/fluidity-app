-- migrate:up
ALTER TABLE lootbox_referrals
  ALTER COLUMN created_time SET DEFAULT NOW();

-- migrate:down

