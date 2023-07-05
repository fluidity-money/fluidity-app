-- migrate:up

ALTER TABLE worker_emissions ADD COLUMN wombat_fee DOUBLE PRECISION DEFAULT 0.0;

-- migrate:down

ALTER TABLE worker_emissions DROP COLUMN wombat_fee;
