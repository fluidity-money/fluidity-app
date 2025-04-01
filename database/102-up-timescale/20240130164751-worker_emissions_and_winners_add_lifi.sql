-- migrate:up

ALTER TABLE worker_emissions
	ADD COLUMN lifi_fee DOUBLE PRECISION DEFAULT 0.0;

DO $$ BEGIN
	ALTER TYPE ethereum_application ADD VALUE 'lifi';
EXCEPTION
	WHEN duplicate_object THEN null;
END $$;

-- migrate:down

ALTER TABLE worker_emissions DROP COLUMN lifi_fee;

-- we can't remove lifi from the type properly
