-- migrate:up

ALTER TABLE worker_emissions ADD COLUMN block_number_ethereum UINT256;
ALTER TABLE worker_emissions ADD COLUMN slot_number UINT256;

ALTER TABLE worker_emissions ADD CONSTRAINT network_blocktype_check CHECK ((block_number_ethereum IS NULL) <> (slot_number IS NULL));

-- migrate:down

ALTER TABLE worker_emissions DROP COLUMN block_number_ethereum;
ALTER TABLE worker_emissions DROP COLUMN slot_number;
ALTER TABLE worker_emissions DROP CONSTRAINT network_blocktype_check;
