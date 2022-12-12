-- migrate:up

ALTER TABLE winners
	ADD COLUMN solana_winning_owner_address VARCHAR;

-- migrate:down
ALTER TABLE winners
	DROP COLUMN IF EXISTS solana_winning_owner_address;

