-- migrate:up

ALTER TABLE worker_custom_pool_overrides
	ADD COLUMN delta_weight_num NUMERIC NOT NULL,
	ADD COLUMN delta_weight_denom NUMERIC NOT NULL;

-- migrate:down

ALTER TABLE worker_custom_pool_overrides
	DROP COLUMN delta_weight_num,
	DROP COLUMN delta_weight_denom;
