-- migrate:up

CREATE FUNCTION leaderboard_24_hours_all_time_rating(i INTERVAL DEFAULT now() - to_timestamp('0'), network_ network_blockchain)
...
SELECT
  row_number() OVER () AS rank,
  address,
  COALESCE(volume, 0) AS volume,
  yield_earned,
  number_of_transactions
FROM
  (
    SELECT
      count(1) AS number_of_transactions,
      sum(amount / 10 ^ token_decimals) AS volume,
      sender_address as address
    FROM
      user_actions
    WHERE network = network_ AND time > NOW() - i
    GROUP BY
      sender_address
  ) u
  left join (
    SELECT
      sum(winning_amount / 10 ^ token_decimals) AS yield_earned,
      winning_address
    FROM
      winners
    WHERE network = network_ AND awarded_time > NOW() - i
   GROUP BY
      winning_address
  ) w ON u.address = w.winning_address

-- migrate:down

DROP FUNCTION leaderboard_24_hours_all_time_rating;
