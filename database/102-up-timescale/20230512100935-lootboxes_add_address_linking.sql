-- migrate:up

CREATE TABLE ethereum_linked_addresses (
	address VARCHAR NOT NULL,
	owner VARCHAR NOT NULL,
	network network_blockchain NOT NULL
);

-- migrate:down

DROP TABLE ethereum_linked_addresses;

