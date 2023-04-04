-- migrate:up

UPDATE ethereum_pending_reward_type
	SET reward_tier = 1
	WHERE reward_tier = NULL;

ALTER TABLE ethereum_pending_reward_type
	ALTER COLUMN reward_tier SET NOT NULL;

-- migrate:down

ALTER TABLE ethereum_pending_reward_type
	ALTER COLUMN reward_tier DROP NOT NULL;
