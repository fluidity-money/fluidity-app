-- migrate:up

UPDATE lootbox
	SET application = 'none'
	WHERE application IS NULL;

ALTER TABLE lootbox
	ALTER COLUMN application SET NOT NULL;

-- migrate:down

ALTER TABLE lootbox
	ALTER COLUMN application DROP NOT NULL;
