-- migrate:up

-- add a timestamp to each of the records to track their creation

-- at the time of writing, the created_timestamp isn't supported in any of
-- the types in lib

ALTER TABLE ethereum_block_headers ADD
	created_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE ethereum_blocks ADD
	created_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE ethereum_logs ADD
	created_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE ethereum_transactions ADD
	created_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- migrate:down

ALTER TABLE ethereum_block_headers
    DROP COLUMN IF EXISTS created_timestamp;

ALTER TABLE ethereum_block
    DROP COLUMN IF EXISTS created_timestamp;

ALTER TABLE ethereum_logs
    DROP COLUMN IF EXISTS created_timestamp;

ALTER TABLE ethereum_transactions
    DROP COLUMN IF EXISTS created_timestamp;
