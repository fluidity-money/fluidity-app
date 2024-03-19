-- migrate:up

DO $$ BEGIN
	ALTER TYPE ethereum_application ADD VALUE 'camelot_v3';
EXCEPTION
	WHEN duplicate_object THEN null;
END $$;

-- migrate:down
