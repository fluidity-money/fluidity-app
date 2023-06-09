-- migrate:up

ALTER TABLE lootbox
	ALTER COLUMN volume TYPE uint256;

-- migrate:down

ALTER TABLE lootbox
	ALTER COLUMN volume TYPE BIGINT;
