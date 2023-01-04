-- migrate:up

ALTER TABLE winners
	ADD COLUMN solana_winning_owner_address VARCHAR;

-- migrate:down

ALTER TABLE winners
	DROP COLUMN solana_winning_owner_address;
