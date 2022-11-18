-- migrate:up

-- add the network identifier

ALTER TABLE past_winnings
	ADD COLUMN network network_blockchain NOT NULL;

-- migrate:down

ALTER TABLE past_winnings
    DROP COLUMN IF EXISTS network;

