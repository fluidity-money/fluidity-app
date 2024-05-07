-- migrate:up

-- token_prices to contain the current price in US dollars of a token, so that its volume can be correctly scaled
-- if a token is found in user_actions but not token_prices, its price is assumed to be 1 USD.
CREATE TABLE token_prices (
	token_short_name VARCHAR NOT NULL,
	usd_price DOUBLE PRECISION NOT NULL
);

INSERT INTO token_prices (token_short_name, usd_price) VALUES (
	'FLY',
	0.03475
);

DROP FUNCTION total_volume;
CREATE FUNCTION total_volume(network_ network_blockchain, interval_ INTERVAL DEFAULT now() - to_timestamp('0'), address_ VARCHAR DEFAULT NULL)
RETURNS SETOF total_volume_return
LANGUAGE sql
STABLE
AS
$$
SELECT
	-- sum amount, adjusted to token decimals and scaled by a USD price if one exists
	COALESCE(
		SUM(
			-- amount_str or amount adjusted by token decimals or 0 if no entries found
			COALESCE(amount_str::NUMERIC, amount) / (10 ^ token_decimals) * COALESCE(usd_price, 1)
		),
	0) AS total_volume,
	COUNT(1) as action_count
FROM user_actions LEFT JOIN token_prices ON token_prices.token_short_name = user_actions.token_short_name
WHERE
	network = network_
	AND time > now() - interval_
	AND (address_ IS NULL OR (
			sender_address = address_ OR 
			recipient_ADDRESS = address_ OR
			solana_sender_owner_address = address_ OR
			solana_recipient_owner_address = address_
	));
$$;

-- migrate:down

DROP TABLE token_prices;
DROP FUNCTION total_volume;
CREATE FUNCTION total_volume(network_ network_blockchain, interval_ INTERVAL DEFAULT now() - to_timestamp('0'), address_ VARCHAR DEFAULT NULL)
RETURNS SETOF total_volume_return
LANGUAGE sql
STABLE
AS
$$
SELECT
	-- amount_str or amount adjusted by token decimals or 0 if no entries found
	COALESCE(SUM(COALESCE(amount_str::NUMERIC, amount) / 10 ^ token_decimals), 0) AS total_volume,
	COUNT(1) as action_count
FROM user_actions
WHERE
	network = network_
	AND time > now() - interval_
	AND (address_ IS NULL OR (
			sender_address = address_ OR 
			recipient_ADDRESS = address_ OR
			solana_sender_owner_address = address_ OR
			solana_recipient_owner_address = address_
	));
$$;
