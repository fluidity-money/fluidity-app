-- migrate:up

ALTER TABLE worker_emissions
	ADD COLUMN gas_price BIGINT;

-- migrate:down

ALTER TABLE worker_emissions DROP COLUMN gas_price;
