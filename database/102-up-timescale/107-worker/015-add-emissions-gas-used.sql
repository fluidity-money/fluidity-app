
-- migrate:up

ALTER TABLE worker_emissions
	ADD COLUMN gas_used BIGINT,
	ADD COLUMN gas_used_normal DOUBLE PRECISION,
	ADD COLUMN block_base_fee BIGINT,
	ADD COLUMN block_base_fee_normal DOUBLE PRECISION,
	ADD COLUMN max_priority_fee_per_gas BIGINT,
	ADD COLUMN max_priority_fee_per_gas_normal DOUBLE PRECISION,
	ADD COLUMN max_fee_per_gas BIGINT,
	ADD COLUMN max_fee_per_gas_normal DOUBLE PRECISION,
	ADD COLUMN effective_gas_price_normal DOUBLE PRECISION;

-- migrate:down

ALTER TABLE worker_emissions
	DROP COLUMN gas_used,
	DROP COLUMN gas_used_normal,
	DROP COLUMN block_base_fee,
	DROP COLUMN block_base_fee_normal,
	DROP COLUMN max_priority_fee_per_gas,
	DROP COLUMN max_priority_fee_per_gas_normal,
	DROP COLUMN max_fee_per_gas,
	DROP COLUMN max_fee_per_gas_normal,
	DROP COLUMN effective_gas_price_normal;
