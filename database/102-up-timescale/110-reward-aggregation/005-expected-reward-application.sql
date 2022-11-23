-- migrate:up

-- aggregate highest and average reward per application 

-- use all values if no parameter passed
CREATE FUNCTION application_performance(i INTERVAL DEFAULT now() - to_timestamp('0'))
RETURNS TABLE (
    network network_blockchain,
    application application,
    count BIGINT,
    average_reward DOUBLE PRECISION,
    highest_reward DOUBLE PRECISION
)
LANGUAGE sql 
AS
$$
    SELECT 
        network,
        application,
        COUNT(*),
        SUM(winning_amount / (10 ^ token_decimals)) / COUNT(*) AS average_reward,
        MAX(winning_amount / (10 ^ token_decimals)) as highest_reward
    FROM winners
    WHERE awarded_time > NOW() - i
    GROUP BY network, application;
$$;

-- migrate:down

DROP FUNCTION application_performance;

