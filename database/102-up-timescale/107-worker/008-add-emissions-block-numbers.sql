-- migrate:up

ALTER TABLE worker_emissions (
	ADD COLUMN ethereum_block_number UINT256
	ADD COLUMN solana_block_number UINT256
	ADD CONSTRAINT network_blocktype_check CHECK ((ethereum_block_number IS NULL) <> (solana_block_number IS NULL))
);

-- migrate:down

ALTER TABLE worker_emissions DROP COLUMN ethereum_block_number;
ALTER TABLE worker_emissions DROP COLUMN solana_block_number;
ALTER TABLE worker_emissions DROP CONSTRAINT network_blocktype_check;
