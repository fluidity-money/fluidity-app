-- migrate:up

ALTER TYPE ethereum_application ADD VALUE 'dopex';
ALTER TABLE worker_emissions ADD COLUMN dopex_fee DOUBLE PRECISION DEFAULT 0.0;

-- migrate:down

ALTER TABLE worker_emissions DROP COLUMN dopex_fee;

