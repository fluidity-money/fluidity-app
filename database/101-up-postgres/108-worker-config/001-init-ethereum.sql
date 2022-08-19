-- migrate:up

-- worker configuration that was previously hardcoded (set this way for
-- erik to iterate quickly)

CREATE TABLE worker_config_ethereum (
	network network_blockchain NOT NULL,
	compound_blocks_per_day INTEGER,
	default_seconds_since_last_block NUMERIC,
	current_atx_transaction_margin NUMERIC,
	default_transfers_in_block INTEGER
);

INSERT INTO worker_config_ethereum (
	network,
	compound_blocks_per_day,
	default_seconds_since_last_block,
	current_atx_transaction_margin,
	default_transfers_in_block
)

VALUES (
	'ethereum',
	6570,
	13,
	0,
	0
);

-- migrate:down

DROP TABLE worker_config_ethereum;
