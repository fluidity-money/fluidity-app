-- migrate:up
DROP FUNCTION total_reward;


-- Add Pending Winners to Total Reward calculation
CREATE FUNCTION total_reward(i INTERVAL DEFAULT now() - to_timestamp('0'), filter_address TEXT DEFAULT null)
RETURNS SETOF total_reward_return
LANGUAGE sql
STABLE
AS
$$
    SELECT
        network,
        SUM(winning_amount / (10 ^ token_decimals)) AS total_reward,
        COUNT(*)
    FROM (
        SELECT 
            network,
            winning_amount,
            token_decimals,
            -- Force uniquness
            created,
            reward_type
        FROM winners
        WHERE awarded_time > NOW() - i
        AND (filter_address IS null OR winning_address = filter_address)
        UNION SELECT
            network,
            win_amount as winning_amount,
            token_decimals,
            -- Force uniquness
            inserted_date,
            reward_type
        FROM ethereum_pending_winners
        WHERE reward_sent IS false 
        AND (filter_address IS null OR address = filter_address)
    ) AS all_winners
    GROUP BY network;
$$;

-- migrate:down

DROP FUNCTION total_reward;

-- use previous definition in aggregate_functions_fix_total_rewards.sql
CREATE FUNCTION total_reward(i INTERVAL DEFAULT now() - to_timestamp('0'), address TEXT DEFAULT null)
RETURNS SETOF total_reward_return
LANGUAGE sql
STABLE
AS
$$
    SELECT
        network,
        SUM(winning_amount / (10 ^ token_decimals)) AS total_reward,
        COUNT(*)
    FROM winners
    WHERE awarded_time > NOW() - i
    AND (address IS null OR winning_address = address)
    GROUP BY network;
$$;
