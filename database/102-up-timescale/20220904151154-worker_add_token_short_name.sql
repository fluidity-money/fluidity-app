-- migrate:up

ALTER TABLE worker_buffered_atx
	ADD COLUMN token_short_name VARCHAR NOT NULL DEFAULT 'USDC';

-- migrate:down

ALTER TABLE worker_buffered_atx
	DROP COLUMN token_short_name;
