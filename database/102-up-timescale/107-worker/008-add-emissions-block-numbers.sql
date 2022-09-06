-- migrate:up

ALTER TABLE worker_emissions
	ADD COLUMN ethereum_block_number UINT256,
	ADD COLUMN solana_slot_number UINT256,
	ADD CONSTRAINT network_blocktype_check CHECK ((ethereum_block_number IS NULL) <> (solana_slot_number IS NULL));

-- migrate:down

ALTER TABLE worker_emissions
	DROP CONSTRAINT network_blocktype_check,
	DROP COLUMN ethereum_block_number,
	DROP COLUMN solana_slot_number;
