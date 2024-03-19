-- migrate:up

ALTER TABLE worker_emissions
	ADD COLUMN betswirl_fee DOUBLE PRECISION DEFAULT 0.0;

DO $$ BEGIN
	ALTER TYPE ethereum_application ADD VALUE 'betswirl';
EXCEPTION
	WHEN duplicate_object THEN null;
END $$;

-- migrate:down

ALTER TABLE worker_emissions DROP COLUMN betswirl_fee;

-- we can't remove betswirl from the type properly
