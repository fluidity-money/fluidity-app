
-- migrate:up

ALTER TABLE worker_emissions
	ADD COLUMN gas_used BIGINT,
	ADD COLUMN gas_used_normal DOUBLE PRECISION,
	ADD COLUMN block_base_fee BIGINT,
	ADD COLUMN block_base_fee_normal DOUBLE PRECISION;

-- migrate:down

ALTER TABLE worker_emissions
	DROP COLUMN gas_used,
	DROP COLUMN gas_used_normal,
	DROP COLUMN block_base_fee,
	DROP COLUMN block_base_fee_normal;
