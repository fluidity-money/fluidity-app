-- migrate:up

DROP TABLE aggregated_user_transactions_lootbottles_return;

DROP FUNCTION aggregated_user_transactions_lootbottles;

ALTER TABLE aggregated_user_transactions
	ADD COLUMN lootbox_count DECIMAL,
	ADD COLUMN reward_tier INTEGER;

-- migrate:down

ALTER TABLE aggregated_user_transactions
	DROP COLUMN lootbox_count,
	DROP COLUMN reward_tier;

CREATE TABLE aggregated_user_transactions_lootbottles_return (
	token_short_name VARCHAR NOT NULL,
	network network_blockchain NOT NULL,
	time TIMESTAMP WITHOUT TIME ZONE NOT NULL,
	transaction_hash VARCHAR NOT NULL,
	sender_address VARCHAR NOT NULL,
	recipient_address VARCHAR NOT NULL,
	amount DOUBLE PRECISION NOT NULL,
	application VARCHAR NOT NULL,
	winning_amount DOUBLE PRECISION NOT NULL,
	winning_address VARCHAR NOT NULL,
	reward_hash VARCHAR NOT NULL,
	type user_action NOT NULL,
	swap_in BOOLEAN NOT NULL,
	utility_amount DOUBLE PRECISION NOT NULL,
	utility_name VARCHAR NOT NULL,

	lootbox_count DECIMAL,
	reward_tier INTEGER
);

CREATE FUNCTION aggregated_user_transactions_lootbottles()
RETURNS SETOF aggregated_user_transactions_lootbottles_return
LANGUAGE SQL
STABLE
AS
$$
SELECT
	token_short_name,
	network,
	time,
	transaction_hash,
	sender_address,
	recipient_address,
	amount,
	application,
	winning_amount,
	winning_address,
	reward_hash,
	type user_action,
	swap_in,
	utility_amount,
	utility_name,
	lootbox_count,
	reward_tier
FROM
	aggregated_user_transactions
LEFT JOIN (
	SELECT reward_tier, lootbox_count FROM lootbox
) AS lootbox_user_actions ON transaction_hash = aggregated_user_transactions.transaction_hash
$$;
