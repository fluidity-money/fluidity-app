-- migrate:up

CREATE TABLE lootbox_ethereum_linked_addresses (
	address VARCHAR NOT NULL,
	owner VARCHAR NOT NULL,
	network network_blockchain NOT NULL
);

-- migrate:down

DROP TABLE lootbox_ethereum_linked_addresses;

