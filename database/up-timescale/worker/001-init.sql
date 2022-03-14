-- migrate:up

CREATE TABLE worker_buffered_atx (
	block_number BIGINT NOT NULL,
	transaction_count INTEGER NOT NULL
);

-- migrate:down

DROP TABLE IF EXISTS worker_buffered_atx;
