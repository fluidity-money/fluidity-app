-- migrate:up

ALTER TYPE ethereum_application ADD VALUE 'gtrade_v6_1';
ALTER TABLE worker_emissions ADD COLUMN gtrade_v6_1_fee DOUBLE PRECISION DEFAULT 0.0;

-- migrate:down

ALTER TABLE worker_emissions DROP COLUMN gtrade_v6_1_fee;