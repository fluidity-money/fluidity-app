-- migrate:up

ALTER TYPE ethereum_application ADD VALUE 'uniswap_v3';
ALTER TABLE worker_emissions ADD COLUMN uniswap_v3_fee DOUBLE PRECISION DEFAULT 0.0;

-- migrate:down

ALTER TABLE worker_emissions DROP COLUMN uniswap_v3_fee;

