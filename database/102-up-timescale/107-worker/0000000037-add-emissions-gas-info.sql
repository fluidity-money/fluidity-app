
-- migrate:up

ALTER TABLE worker_emissions
	ADD COLUMN gas_limit BIGINT,
	ADD COLUMN gas_tip_cap uint256,
	ADD COLUMN gas_limit_normal DOUBLE PRECISION,
	ADD COLUMN gas_tip_cap_normal DOUBLE PRECISION,
	ADD COLUMN transfer_fee_normal DOUBLE PRECISION;

-- migrate:down

ALTER TABLE worker_emissions
	DROP COLUMN gas_limit,
	DROP COLUMN gas_tip_cap,
	DROP COLUMN gas_limit_normal,
	DROP COLUMN gas_tip_cap_normal,
	DROP COLUMN transfer_fee_normal;
