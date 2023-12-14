
-- migrate:up

CREATE TABLE failsafe_transaction_hash (
	transaction_hash VARCHAR,
	log_index BIGINT,
	worker_id VARCHAR,
	PRIMARY KEY(transaction_hash, log_index, worker_id)
);

-- migrate:down

DROP TABLE failsafe_transaction_hash;
