-- migrate:up

-- credit: Bill Karwin at https://stackoverflow.com/a/19120695
CREATE OR REPLACE VIEW highest_rewards_monthly AS
    SELECT 
        network,
        transaction_hash, 
        winning_address, 
        winning_amount, 
        date_trunc('day', awarded_time) as awarded_day, 
        created, 
        token_short_name, 
        winning_amount / (10 ^ token_decimals) AS winning_amount_scaled,
        token_decimals 
    FROM (
        SELECT *, 
        ROW_NUMBER() OVER (
            PARTITION BY date_trunc('day', awarded_time), network 
            ORDER BY winning_amount / (10 ^ token_decimals) DESC
        ) AS _rn FROM winners
    ) 
    AS _max 
    WHERE _rn = 1 AND awarded_time > now() - interval '1 month' 
    ORDER BY awarded_time;

CREATE OR REPLACE VIEW highest_reward_winner_totals AS
    SELECT
        COUNT(*) AS transaction_count, 
        winning_address, 
        SUM(winning_amount / (10 ^ token_decimals)) AS total_winnings 
    FROM winners 
    WHERE winning_address IN (
        SELECT winning_address FROM highest_rewards_monthly
    ) GROUP BY winning_address;

-- migrate:down

DROP VIEW IF EXISTS highest_rewards_monthly;
DROP VIEW IF EXISTS highest_reward_winner_totals;
