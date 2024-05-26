
-- migrate:up

ALTER TABLE worker_config_ethereum
	ADD COLUMN yield_to_stakers BOOLEAN NOT NULL DEFAULT FALSE;

-- migrate:down

ALTER TABLE worker_config_ethereum
	DROP COLUMN yield_to_stakers;
