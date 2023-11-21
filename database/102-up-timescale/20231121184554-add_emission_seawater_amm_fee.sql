-- migrate:up

ALTER TABLE worker_emissions
	ADD COLUMN seawater_amm_fee DOUBLE PRECISION DEFAULT 0.0;

-- migrate:down

ALTER TABLE worker_emissions seawater_amm_fee;
