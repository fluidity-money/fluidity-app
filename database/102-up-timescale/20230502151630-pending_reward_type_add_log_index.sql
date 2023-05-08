-- migrate:up

ALTER TABLE ethereum_pending_reward_type
	ADD COLUMN log_index BIGINT NOT NULL DEFAULT 0;

-- migrate:down

ALTER TABLE ethereum_pending_reward_type
	DROP COLUMN log_index;
