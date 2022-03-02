
-- transaction that we track for the second stage of the beta in its
-- unique format

CREATE TABLE beta_transactions (
	transaction_hash VARCHAR NOT NULL,
	block_hash VARCHAR NOT NULL,
	from_address VARCHAR NOT NULL,
	to_address VARCHAR NOT NULL,
	contract_call BOOLEAN NOT NULL,
	was_winning BOOLEAN NOT NULL
);
