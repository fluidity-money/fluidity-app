-- migrate:up

-- a list of unique addresses that were active in the testnet
CREATE TABLE testnet_address (
	address VARCHAR NOT NULL PRIMARY KEY
);

-- mainnet address that owns a given testnet address
CREATE TABLE testnet_owner (
	owner VARCHAR NOT NULL,
	testnet_address VARCHAR UNIQUE REFERENCES testnet_address(address)
);

-- migrate:down

DROP TABLE testnet_owner;
DROP TABLE testnet_address;
