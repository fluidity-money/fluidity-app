-- migrate:up

ALTER TABLE lootbox
	ADD COLUMN application ethereum_application;

-- migrate:down

ALTER TABLE lootbox
	DROP COLUMN application;
