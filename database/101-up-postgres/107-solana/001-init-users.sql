-- migrate:up

CREATE TABLE solana_users (
	address VARCHAR NOT NULL,
	amount_minted uint256 NOT NULL,
	last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,

	CONSTRAINT last_minted_non_negative CHECK (amount_minted >= 0)
);

-- migrate:down

DROP TABLE solana_users;
