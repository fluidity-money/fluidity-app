-- migrate:up

DO $$ BEGIN
	ALTER TYPE network_blockchain ADD VALUE 'zk_sync';
EXCEPTION
	WHEN duplicate_object THEN null;
END $$;

-- migrate:down

-- there's no good way to remove enum variants
