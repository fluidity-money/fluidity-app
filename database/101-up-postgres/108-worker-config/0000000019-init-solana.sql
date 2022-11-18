-- migrate:up

-- worker configuration for solana

CREATE TABLE worker_config_solana (
	solana_block_time INTEGER,
	transfer_compute NUMERIC
);

INSERT INTO worker_config_solana (
	solana_block_time,
	transfer_compute
)

VALUES (
	1,
	2721
);

-- migrate:down

DROP TABLE worker_config_solana;
