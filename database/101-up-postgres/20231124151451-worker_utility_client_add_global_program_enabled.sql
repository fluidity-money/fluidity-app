-- migrate:up

ALTER TABLE worker_custom_pool_overrides
	ADD COLUMN is_enabled BOOLEAN NOT NULL DEFAULT TRUE;

-- migrate:down

ALTER TABLE worker_custom_pool_overrides
	DROP COLUMN is_enabled;
