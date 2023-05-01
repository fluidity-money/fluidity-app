-- migrate:up

CREATE TABLE custom_pool_overrides (
	network network_blockchain NOT NULL,
	utility_name VARCHAR NOT NULL,
	payout_freq_num NUMERIC NOT NULL,
	payout_freq_denom NUMERIC NOT NULL,
	winning_classes INT NOT NULL
);

-- migrate:down

DROP TABLE custom_pool_overrides;

