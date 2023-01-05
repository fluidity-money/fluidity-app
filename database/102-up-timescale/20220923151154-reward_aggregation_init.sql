-- migrate:up

-- aggregate rewards daily for each network

CREATE MATERIALIZED VIEW aggregated_rewards_daily
WITH (timescaledb.continuous) AS
SELECT 
    network,
    SUM(winning_amount / (10 ^ token_decimals)) AS winning_amount,
    time_bucket(INTERVAL '1 day', awarded_time) AS awarded_day
FROM winners
GROUP BY awarded_day, network
WITH NO DATA;

SELECT add_continuous_aggregate_policy('aggregated_rewards_daily',
    start_offset => NULL,
    end_offset => INTERVAL '1 day',
    schedule_interval => INTERVAL '1 hour');

-- aggregate rewards monthly for each network

CREATE MATERIALIZED VIEW aggregated_rewards_monthly
WITH (timescaledb.continuous) AS
SELECT 
    network,
    SUM(winning_amount / (10 ^ token_decimals)) AS winning_amount,
    time_bucket(INTERVAL '1 month', awarded_time) AS awarded_month
FROM winners
GROUP BY awarded_month, network
WITH NO DATA;

SELECT add_continuous_aggregate_policy('aggregated_rewards_monthly',
    start_offset => NULL,
    end_offset => INTERVAL '1 month',
    schedule_interval => INTERVAL '1 hour');

-- migrate:down

DROP MATERIALIZED VIEW aggregated_rewards_daily;
DROP MATERIALIZED VIEW aggregated_rewards_monthly;
