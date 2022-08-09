-- migrate:up

ALTER TABLE worker_emissions ADD COLUMN last_updated TIMESTAMP NOT NULL;

-- migrate:down

ALTER TABLE worker_emissions DROP COLUMN last_updated;
