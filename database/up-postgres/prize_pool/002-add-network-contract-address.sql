-- migrate:up

-- add the network and the contract address to the prize pool

ALTER TABLE prize_pool ADD
	network network_blockchain NOT NULL;

ALTER TABLE prize_pool ADD
	contract_address VARCHAR NOT NULL;

-- migrate:down

ALTER TABLE prize_pool
    DROP COLUMN IF EXISTS network;

ALTER TABLE prize_pool
    DROP COLUMN IF EXISTS contract_address;