-- migrate:up
CREATE TABLE total_volume_return (
    total_volume DOUBLE PRECISION,
    action_count BIGINT
);

-- aggregate volume and user action count from the given interval until now
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
	AND (address_ IS NULL OR (sender_address = address_ OR recipient_ADDRESS = address_));
$$;

-- migrate:down

DROP FUNCTION total_volume;
DROP TABLE total_volume_return;
