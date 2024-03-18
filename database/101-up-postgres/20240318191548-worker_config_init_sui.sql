CREATE TABLE worker_config_sui (
	network network_blockchain NOT NULL,
	sui_block_time INTEGER,
	spooler_instant_reward_threshold REAL NOT NULL
	spooler_batched_reward_threshold REAL NOT NULL
);

INSERT INTO worker_config_ethereum (
	network,
	compound_blocks_per_day,
	default_seconds_since_last_block,
	current_atx_transaction_margin,
	default_transfers_in_block
)

VALUES (
	'sui',
	5,
	1,
	0.1
);

-- migrate:down

DROP TABLE worker_config_ethereum;
