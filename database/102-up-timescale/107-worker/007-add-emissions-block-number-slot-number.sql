-- migrate:up

ALTER TABLE worker_emissions
	ADD COLUMN ethereum_block_number BIGINT NOT NULL DEFAULT 0,
	ADD COLUMN solana_slot_number BIGINT NOT NULL DEFAULT 0;

-- migrate:down

ALTER TABLE worker_emissions
	DROP COLUMN ethereum_block_number,
	DROP COLUMN solana_slot_number;
