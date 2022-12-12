-- migrate:up

CREATE TABLE worker_buffered_atx (
	block_number BIGINT NOT NULL,
	transaction_count INTEGER NOT NULL
);

-- migrate:down

DROP TABLE  worker_buffered_atx;

