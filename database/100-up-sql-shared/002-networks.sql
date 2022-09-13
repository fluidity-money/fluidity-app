-- migrate:up

-- add the current blockchain backends that we support, ethereum and solana

CREATE TYPE network_blockchain AS ENUM (
	'ethereum',
	'solana'
);

-- migrate:down

DROP TYPE network_blockchain;

