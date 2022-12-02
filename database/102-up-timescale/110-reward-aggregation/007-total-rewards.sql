-- migrate:up
CREATE TABLE total_reward_return (
    network network_blockchain,
    total_reward DOUBLE PRECISION,
    count BIGINT
);

-- use all values if no time param
CREATE FUNCTION total_reward(i INTERVAL DEFAULT now() - to_timestamp('0'), address TEXT DEFAULT null)
RETURNS total_reward_return
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

DROP FUNCTION total_reward;

DROP TABLE total_reward_return;
