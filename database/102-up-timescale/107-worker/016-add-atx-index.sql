--migrate:up

CREATE INDEX atx_blocknum ON worker_buffered_atx (block_number DESC);

-- migrate:down

DROP INDEX IF EXISTS atx_blocknum;
