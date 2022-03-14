-- migrate:up

CREATE TABLE compound_comptroller_market_listed (
	network INTEGER NOT NULL,
	transaction_hash VARCHAR NOT NULL,
	block_hash VARCHAR NOT NULL,
	picked_up TIMESTAMP NOT NULL,

	token_address VARCHAR NOT NULL
);

CREATE TABLE compound_ctoken_accrue_interest (
	network INTEGER NOT NULL,
	transaction_hash VARCHAR NOT NULL,
	block_hash VARCHAR NOT NULL,
	picked_up TIMESTAMP NOT NULL,

	cash_prior uint256 NOT NULL,
	interest_accumulated BIGINT NOT NULL,
	borrow_index BIGINT NOT NULL,
	total_borrows BIGINT NOT NULL
);

-- migrate:down

DROP TABLE IF EXISTS
    compount_comptroller_market_listed;

DROP TABLE IF EXISTS
    compound_ctoken_accrue_interest;