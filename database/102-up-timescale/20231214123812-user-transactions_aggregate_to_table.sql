-- migrate:up

-- adapted from user_transactions_aggregate_return
CREATE TABLE aggregated_user_transactions (
	token_short_name TEXT,
	network network_blockchain,
	time TIMESTAMP,
	transaction_hash VARCHAR UNIQUE,
	sender_address VARCHAR,
	recipient_address VARCHAR,
	amount DOUBLE PRECISION,
	application VARCHAR,
	winning_amount DOUBLE PRECISION,
	winning_address VARCHAR,
	reward_hash VARCHAR,
	type user_action,
	swap_in BOOLEAN,
	utility_amount DOUBLE PRECISION,
	utility_name VARCHAR
);

-- migrate:down

DROP TABLE aggregated_user_transactions;
