-- migrate:up

-- patch fix - 110-reward-aggregation/007-total-rewards was migrated out of order
DROP FUNCTION total_reward;

-- use all values if no time param
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

-- migrate:down

-- No down migrations - functions are deleted in 110-reward-aggregation/007-total-rewards
