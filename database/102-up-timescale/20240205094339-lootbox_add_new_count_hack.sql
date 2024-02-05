-- migrate:up

-- this was a hack that was implemented to improve the bottle count
-- calculation with the easiest way possible. this is a one-off for the
-- airdrop campaign.

ALTER TABLE lootbox
	ADD COLUMN modifier_applied BOOLEAN NOT NULL DEFAULT FALSE,
	ADD COLUMN new_count NUMERIC NOT NULL DEFAULT 0;

-- migrate:down

ALTER TABLE lootbox
	DROP COLUMN modifier_applied,
	DROP COLUMN new_count;
