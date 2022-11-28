
-- migrate:up

ALTER TABLE winners
	ADD COLUMN send_transaction_hash VARCHAR
	DEFAULT '';

ALTER TABLE winners
	ALTER COLUMN send_transaction_hash DROP DEFAULT;

-- migrate:down

ALTER TABLE winners
	DROP COLUMN send_transaction_hash;
