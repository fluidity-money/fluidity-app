-- migrate:up
CREATE TABLE trading_leaderboard_return (
    address VARCHAR,
    volume DOUBLE PRECISION,
);

-- aggregate volume within epoch time range filtering for application
CREATE FUNCTION trading_leaderboard(network_ network_blockchain, start_time TIMESTAMP, end_time TIMESTAMP, application_ ethereum_application DEFAULT NULL, address_ VARCHAR DEFAULT NULL)
RETURNS SETOF trading_leaderboard_return
LANGUAGE sql
STABLE
AS
$$
SELECT
  COALESCE(SUM(COALESCE(amount_str::NUMERIC, amount) / 10 ^ token_decimals), 0) AS volume,
  address
FROM user_actions
WHERE
  network = network_
  AND time >= start_time
  AND time < end_time
	AND (application_ IS NULL OR (application = application_))
	AND (address_ IS NULL OR (sender_address = address_ OR recipient_ADDRESS = address_));
GROUP BY address;
$$;

-- migrate:down
DROP FUNCTION trading_leaderboard;
DROP TABLE trading_leaderboard_return;

