-- migrate:up

ALTER TABLE worker_emissions ADD COLUMN apeswap_fee DOUBLE PRECISION DEFAULT 0.0;

-- migrate:down

ALTER TABLE worker_emissions DROP COLUMN apeswap_fee;
