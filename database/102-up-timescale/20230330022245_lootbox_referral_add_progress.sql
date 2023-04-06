-- migrate:up
ALTER TABLE lootbox_referrals
  ADD COLUMN created_time TIMESTAMP NOT NULL,
  ADD COLUMN active BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN progress NUMERIC NOT NULL DEFAULT 0;
  

-- migrate:down
ALTER TABLE lootbox_referrals
DROP COLUMN (
  created_time
  active
  progress
);

