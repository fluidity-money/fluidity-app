-- migrate:up

CREATE TABLE solana_mint_limits (
	token_short_name VARCHAR NOT NULL,
	token_decimals INT NOT NULL,
	mint_limit uint256 NOT NULL
);

-- migrate:down

DROP TABLE solana_mint_limits;
