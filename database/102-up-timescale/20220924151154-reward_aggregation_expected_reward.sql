-- migrate:up

-- aggregate winnings per token to create expected reward

CREATE MATERIALIZED VIEW expected_rewards
WITH (timescaledb.continuous) AS
SELECT 
    network,
    token_short_name,
    COUNT(*),
    SUM(winning_amount / (10 ^ token_decimals)) / COUNT(*) AS average_reward,
    MAX(winning_amount / (10 ^ token_decimals)) as highest_reward,
    time_bucket(INTERVAL '1 month', awarded_time) AS awarded_month
FROM winners
GROUP BY awarded_month, network, token_short_name
WITH NO DATA;

SELECT add_continuous_aggregate_policy('expected_rewards',
    start_offset => NULL,
    end_offset => INTERVAL '1 month',
    schedule_interval => INTERVAL '1 hour');

-- migrate:down

DROP MATERIALIZED VIEW expected_rewards;
