-- migrate:up

ALTER TABLE ethereum_pending_reward_type
	ADD COLUMN log_index BIGINT;

-- migrate:down

ALTER TABLE ethereum_pending_reward_type
	DROP COLUMN log_index BIGINT;
