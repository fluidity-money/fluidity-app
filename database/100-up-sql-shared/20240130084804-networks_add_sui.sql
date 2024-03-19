-- migrate:up

DO $$ BEGIN
	ALTER TYPE network_blockchain ADD VALUE 'sui';
EXCEPTION
	WHEN duplicate_object THEN null;
END $$;

-- migrate:down

-- this is not possible easily so we won't bother!
