-- migrate:up

-- credit: Bill Karwin at https://stackoverflow.com/a/19120695
CREATE OR REPLACE FUNCTION highest_rewards_monthly()
RETURNS TABLE (
        network network_blockchain,
        transaction_hash VARCHAR, 
        winning_address VARCHAR, 
        winning_amount uint256, 
        awarded_time TIMESTAMP, 
        created TIMESTAMP, 
        token_short_name VARCHAR, 
        winning_amount_scaled FLOAT,
        token_decimals INT 
)
LANGUAGE plpgsql
AS
$$
BEGIN
RETURN QUERY
    SELECT 
        _max.network,
        _max.transaction_hash, 
        _max.winning_address, 
        _max.winning_amount, 
        _max.awarded_time, 
        _max.created, 
        _max.token_short_name, 
        _max.winning_amount / (10 ^ _max.token_decimals) AS winning_amount_scaled,
        _max.token_decimals 
    FROM (
        SELECT *, 
        ROW_NUMBER() OVER (
            PARTITION BY date_trunc('day', winners.awarded_time), winners.network 
            ORDER BY winners.winning_amount / (10 ^ winners.token_decimals) DESC
        ) AS _rn FROM winners
    ) 
    AS _max 
    WHERE _rn = 1 AND _max.awarded_time > now() - interval '1 month' 
    ORDER BY _max.awarded_time;
END;
$$;

CREATE OR REPLACE FUNCTION highest_reward_winner_totals()
RETURNS TABLE (
    winning_address VARCHAR,
    total_winnings FLOAT 
    transaction_count BIGINT,
)
LANGUAGE plpgsql
AS
$$
BEGIN
RETURN QUERY
    SELECT
        COUNT(*) AS transaction_count, 
        winners.winning_address, 
        SUM(winners.winning_amount / (10 ^ winners.token_decimals)) AS total_winnings 
    FROM winners 
    WHERE winners.winning_address IN (
        SELECT _a.winning_address FROM highest_rewards_monthly() AS _a
    ) GROUP BY winners.winning_address;
END;
$$;

-- migrate:down

DROP FUNCTION IF EXISTS highest_rewards_monthly;
DROP FUNCTION IF EXISTS highest_reward_winner_totals;
