-- migrate:up

CREATE TABLE leaderboard_ranking_return(
  rank BIGINT,
  address VARCHAR,
  volume DOUBLE PRECISION,
  yield_earned DOUBLE PRECISION,
  number_of_transactions BIGINT
);

-- returns a list of addresses and their volume, yield, and transaction count over a given interval.
CREATE FUNCTION leaderboard_ranking(network_ network_blockchain, i INTERVAL DEFAULT NOW() - to_timestamp('0')) 
RETURNS SETOF leaderboard_ranking_return
LANGUAGE SQL
STABLE
AS
$$
SELECT
  row_number() OVER () AS rank,
  address,
  COALESCE(volume, 0) AS volume,
  COALESCE(yield_earned, 0) AS yield_earned,
  number_of_transactions
FROM
  (
    SELECT
      COUNT(1) AS number_of_transactions,
      SUM(amount / 10 ^ token_decimals) AS volume,
      sender_address AS address
    FROM
      user_actions
    WHERE network = network_ AND time > NOW() - i
    GROUP BY
      sender_address
  ) u
  LEFT JOIN (
    SELECT
      SUM(winning_amount / 10 ^ token_decimals) AS yield_earned,
      winning_address
    FROM
      winners
    WHERE network = network_ AND awarded_time > NOW() - i
   GROUP BY
      winning_address
  ) w ON u.address = w.winning_address
ORDER BY volume DESC;
$$

-- migrate:down

DROP FUNCTION leaderboard_ranking;
DROP TABLE leaderboard_ranking_return;
