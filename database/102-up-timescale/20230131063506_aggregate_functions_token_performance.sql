-- migrate:up

-- aggregate highest and average reward per application 

-- create a dummy table for SETOF return, as per:
-- https://github.com/hasura/graphql-engine/issues/4376#issuecomment-612631390
CREATE TABLE token_performance_return (
    token VARCHAR,
    count BIGINT,
    average_reward DOUBLE PRECISION,
    highest_reward DOUBLE PRECISION
);

-- use all values if no parameter passed
CREATE FUNCTION token_performance(filter_network network_blockchain, i INTERVAL DEFAULT now() - to_timestamp('0'), address TEXT DEFAULT null)
RETURNS SETOF token_performance_return
LANGUAGE sql 
STABLE
AS
$$
    SELECT 
        token_short_name as token,
        COUNT(*),
        SUM(winning_amount / (10 ^ token_decimals)) / COUNT(*) AS average_reward,
        MAX(winning_amount / (10 ^ token_decimals)) as highest_reward
    FROM winners
    WHERE network = filter_network
    AND (address IS null OR winning_address = address)
    AND awarded_time > NOW() - i
    GROUP BY token;
$$;

-- migrate:down

DROP FUNCTION token_performance;

DROP TABLE token_performance_return;

