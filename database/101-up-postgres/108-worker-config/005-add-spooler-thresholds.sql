-- migrate:up

ALTER TABLE worker_config_ethereum
	ADD COLUMN spooler_instant_reward_threshold REAL NOT NULL
	DEFAULT 1;

ALTER TABLE worker_config_ethereum
	ALTER COLUMN spooler_instant_reward_threshold DROP DEFAULT;

ALTER TABLE worker_config_ethereum
	ADD COLUMN spooler_batched_reward_threshold REAL NOT NULL
	DEFAULT 0.1;

ALTER TABLE worker_config_ethereum
	ALTER COLUMN spooler_batched_reward_threshold DROP DEFAULT;

-- migrate:down

ALTER TABLE worker_config_ethereum
	DROP COLUMN spooler_instant_reward_threshold;

ALTER TABLE worker_config_ethereum
	DROP COLUMN spooler_batched_reward_threshold;
