-- migrate:up

ALTER TABLE worker_emissions
	ADD COLUMN sushiswap_fee DOUBLE PRECISION DEFAULT 0.0;

-- migrate:down

ALTER TABLE worker_emissions DROP COLUMN sushiswap_fee;
