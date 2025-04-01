-- migrate:up

ALTER TABLE worker_emissions
	ADD COLUMN odos_fee DOUBLE PRECISION DEFAULT 0.0;

DO $$ BEGIN
	ALTER TYPE ethereum_application ADD VALUE 'odos';
EXCEPTION
	WHEN duplicate_object THEN null;
END $$;

-- migrate:down

ALTER TABLE worker_emissions DROP COLUMN odos_fee;

-- we can't remove odos from the type properly
