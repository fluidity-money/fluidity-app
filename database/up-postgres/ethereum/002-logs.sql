-- migrate:up

-- add Ethereum logs and topics as separate tables

CREATE TABLE ethereum_logs (
	address VARCHAR NOT NULL,
	data VARCHAR NOT NULL,
	block_number BIGINT NOT NULL,
	transaction_hash VARCHAR NOT NULL,
	transaction_index INTEGER NOT NULL,

	-- block_hash that contains the
	block_hash VARCHAR NOT NULL,

	-- the index of the log within the block
	index INTEGER NOT NULL,

	-- topics in the log are unrolled and inserted here

	topic_1 VARCHAR NOT NULL,
	topic_2 VARCHAR,
	topic_3 VARCHAR,
	topic_4 VARCHAR
);

-- migrate:down

DROP TABLE IF EXISTS ethereum_logs;