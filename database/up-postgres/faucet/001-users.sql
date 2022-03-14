-- migrate:up

CREATE TABLE faucet_users (

	address VARCHAR NOT NULL,

	unique_address VARCHAR NOT NULL,

	ip_address VARCHAR NOT NULL,

	network network_blockchain NOT NULL,

	last_used TIMESTAMP
);

-- migrate:down

DROP TABLE IF EXISTS faucet_users;