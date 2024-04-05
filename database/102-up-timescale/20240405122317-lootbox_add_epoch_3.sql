-- migrate:up

DO $$ BEGIN
	ALTER TYPE lootbox_epoch ADD VALUE 'epoch_3';
EXCEPTION
	WHEN duplicate_object THEN null;
END $$;

-- migrate:down
