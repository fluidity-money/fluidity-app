-- migrate:up

CREATE TABLE solana_users (
	address VARCHAR NOT NULL UNIQUE,
	amount_minted DOUBLE PRECISION NOT NULL,
	last_updated TIMESTAMP NOT NULL,

	CONSTRAINT last_minted_non_negative CHECK (amount_minted >= 0)
);

-- migrate:down

DROP TABLE solana_users;
