-- migrate:up

ALTER TABLE ethereum_pending_reward_type
	ADD COLUMN utility VARCHAR DEFAULT 'FLUID' NOT NULL;

ALTER TABLE ethereum_pending_reward_type
	ALTER COLUMN utility DROP DEFAULT;

-- migrate:down

ALTER TABLE ethereum_pending_reward_type
	DROP COLUMN utility;
