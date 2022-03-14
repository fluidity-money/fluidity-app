-- migrate:up

-- init creates codependent generic tables without any of the size
-- considerations

CREATE TABLE ethereum_block_headers (
	parent_hash VARCHAR NOT NULL,
	uncle_hash VARCHAR NOT NULL,
	coinbase VARCHAR NOT NULL,
	root VARCHAR NOT NULL,
	transaction_hash VARCHAR NOT NULL,
	bloom VARCHAR NOT NULL,
	difficulty uint256 NOT NULL,
	number BIGINT NOT NULL,
	gas_limit uint256 NOT NULL,
	time TIMESTAMP NOT NULL,
	extra VARCHAR NOT NULL,
	mix_digest VARCHAR NOT NULL,
	nonce BIGINT NOT NULL,
	base_fee uint256 NOT NULL
);

CREATE TABLE ethereum_blocks (

	-- block_hash is the hash of the block, used by ethereum_transactions
	-- to identify the parent of the transaction.

	block_hash VARCHAR NOT NULL,

	base_fee uint256 NOT NULL,

	-- transactions are not included here, use the block_hash to search in
	-- ethereum_transactions

	coinbase VARCHAR NOT NULL,
	difficulty uint256 NOT NULL,
	extra VARCHAR NOT NULL,
	hash VARCHAR NOT NULL,

	-- block_header is not included here, use the block_hash to find headers

	mix_digest VARCHAR NOT NULL,
	number BIGINT NOT NULL,
	parent_hash VARCHAR NOT NULL,
	receipt_hash VARCHAR NOT NULL,
	root VARCHAR NOT NULL,
	size BIGINT NOT NULL,
	time TIMESTAMP NOT NULL,
	transaction_hash VARCHAR NOT NULL,

	-- uncles is not included

	uncle_hash VARCHAR NOT NULL
);

CREATE TABLE ethereum_transactions (

	-- block_hash is the block that originated this transaction

	block_hash VARCHAR NOT NULL,

	chain_id INTEGER NOT NULL,
	cost uint256 NOT NULL,
	data VARCHAR NOT NULL,
	gas uint256 NOT NULL,
	gas_fee_cap uint256 NOT NULL,
	gas_price uint256 NOT NULL,
	hash VARCHAR NOT NULL,
	nonce BIGINT NOT NULL,
	to_ VARCHAR NOT NULL,
	from_ VARCHAR NOT NULL,
	type INTEGER NOT NULL,
	value uint256 NOT NULL
);

-- migrate:down

DROP TABLE IF EXISTS ethereum_block_headers;

DROP TABLE IF EXISTS ethereum_blocks;

DROP TABLE IF EXISTS ethereum_transactions;
