--migrate:up

CREATE TABLE worker_config_sui (
	network network_blockchain NOT NULL,
	sui_block_time INTEGER,
	spooler_instant_reward_threshold REAL NOT NULL
	spooler_batched_reward_threshold REAL NOT NULL
);

INSERT INTO worker_config_sui (
	network,
	sui_block_time,
	spooler_instant_reward_threshold,
	spooler_batched_reward_threshold
)

VALUES (
	'sui',
	5,
	1,
	0.1
);

-- migrate:down

DROP TABLE worker_config_ethereum;
