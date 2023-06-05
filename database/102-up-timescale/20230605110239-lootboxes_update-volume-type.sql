-- migrate:up

ALTER TABLE lootbox
	ALTER COLUMN volume TYPE NUMERIC;

-- migrate:down

ALTER TABLE lootbox
	ALTER COLUMN volume TYPE BIGINT;
