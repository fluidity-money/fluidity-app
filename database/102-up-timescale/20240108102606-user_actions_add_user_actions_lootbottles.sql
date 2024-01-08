-- migrate:up

-- this is a copy of user_actions

CREATE TABLE user_actions_lootbottles_return (
	event_number BIGINT NOT NULL,
	network network_blockchain NOT NULL,
	type user_action NOT NULL,
	swap_in BOOLEAN,
	sender_address VARCHAR NOT NULL,
	recipient_address VARCHAR,
	amount uint256 NOT NULL,
	time TIMESTAMP NOT NULL,
	transaction_hash VARCHAR NOT NULL,
	token_short_name VARCHAR NOT NULL,
	token_decimals INTEGER NOT NULL,
	solana_sender_owner_address VARCHAR NOT NULL,
	solana_recipient_owner_address VARCHAR NOT NULL,
	log_index BIGINT NOT NULL,
	amount_str VARCHAR NOT NULL,
	application VARCHAR NOT NULL,

	-- extra sections for the lootbottles
	reward_tier INTEGER,
	lootbox_count NUMERIC
);

CREATE FUNCTION user_actions_lootbottles()
RETURNS SETOF user_actions_lootbottles_return
LANGUAGE SQL
STABLE
AS
$$
SELECT
	event_number,
	network network_blockchain,
	type user_action,
	swap_in,
	sender_address,
	recipient_address,
	amount,
	time,
	transaction_hash,
	token_short_name,
	token_decimals,
	solana_sender_owner_address,
	solana_recipient_owner_address,
	log_index,
	amount_str,
	application,
	lootbox_user_actions.reward_tier,
	lootbox_user_actions.lootbox_count
FROM
	user_actions
LEFT JOIN (
	SELECT reward_tier, lootbox_count FROM lootbox
) AS lootbox_user_actions ON transaction_hash = user_actions.transaction_hash
$$;

-- migrate:down

DROP TABLE user_actions_lootbottles_return;

DROP FUNCTION user_actions_lootbottles;
