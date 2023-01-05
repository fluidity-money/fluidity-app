-- migrate:up

INSERT INTO worker_config_ethereum (
	network,
	compound_blocks_per_day,
	default_seconds_since_last_block,
	current_atx_transaction_margin,
	default_transfers_in_block,
	atx_buffer_size,
	spooler_instant_reward_threshold,
	spooler_batched_reward_threshold
)

VALUES (
	'arbitrum',
	86400,
	1,
	0,
	0,
	30,
	1,
	1
);

-- migrate:down

DELETE FROM worker_config_ethereum WHERE network = 'arbitrum';
