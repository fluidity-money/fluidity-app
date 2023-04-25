-- migrate:up

ALTER TABLE ethereum_pending_reward_type
	ALTER COLUMN reward_tier SET DEFAULT 1,
	ALTER COLUMN reward_tier SET NOT NULL;

-- migrate:down

ALTER TABLE ethereum_pending_reward_type
	ALTER COLUMN reward_tier DROP DEFAULT,
	ALTER COLUMN reward_tier DROP NOT NULL;
