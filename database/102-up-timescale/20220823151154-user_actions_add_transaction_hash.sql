-- migrate:up

ALTER TABLE user_actions
	ADD COLUMN transaction_hash VARCHAR NOT NULL;

-- migrate:down

ALTER TABLE user_actions DROP COLUMN transaction_hash;
