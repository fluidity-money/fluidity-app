-- migrate:up

DO $$ BEGIN
	ALTER TYPE network_blockchain ADD VALUE 'polygon_zk';
EXCEPTION
	WHEN duplicate_object THEN null;
END $$;

-- migrate:down

-- there's no good way to remove enum variants
