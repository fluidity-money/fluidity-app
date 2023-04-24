-- migrate:up

-- recreate worker_buffered_atx as a new index on token details

DROP INDEX atx_blocknum;

CREATE INDEX atx_blocks_by_token ON worker_buffered_atx (network, token_short_name, block_number DESC);

-- migrate:down

CREATE INDEX atx_blocknum ON worker_buffered_atx (block_number DESC);

DROP INDEX worker_buffered_atx__network_token_short_name_block_number_idx;
