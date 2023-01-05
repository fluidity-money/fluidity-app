-- migrate:up

-- aggregate highest and average reward per application 

-- create a dummy table for SETOF return, as per:
-- https://github.com/hasura/graphql-engine/issues/4376#issuecomment-612631390
CREATE TABLE app_performance_return (
    network network_blockchain,
    application VARCHAR,
    count BIGINT,
    average_reward DOUBLE PRECISION,
    highest_reward DOUBLE PRECISION
);

DROP FUNCTION application_performance;

-- use all values if no parameter passed
CREATE FUNCTION application_performance(i INTERVAL DEFAULT now() - to_timestamp('0'))
RETURNS SETOF app_performance_return
LANGUAGE sql 
STABLE
AS
$$
    SELECT 
        network,
        CASE 
            WHEN network = 'ethereum' THEN ethereum_application::varchar
            WHEN network = 'solana' THEN solana_application::varchar
        END AS application,         
        COUNT(*),
        SUM(winning_amount / (10 ^ token_decimals)) / COUNT(*) AS average_reward,
        MAX(winning_amount / (10 ^ token_decimals)) as highest_reward
    FROM winners
    WHERE awarded_time > NOW() - i
    GROUP BY network, application;
$$;

-- migrate:down

DROP FUNCTION application_performance;
CREATE OR REPLACE FUNCTION application_performance(i INTERVAL DEFAULT now() - to_timestamp('0'))
RETURNS TABLE (
    network network_blockchain,
    application varchar,
    count BIGINT,
    average_reward DOUBLE PRECISION,
    highest_reward DOUBLE PRECISION
)
LANGUAGE sql 
AS
$$
    SELECT 
        network,
        CASE 
            WHEN network = 'ethereum' THEN ethereum_application::varchar
            WHEN network = 'solana' THEN solana_application::varchar
        END AS application,         
        COUNT(*),
        SUM(winning_amount / (10 ^ token_decimals)) / COUNT(*) AS average_reward,
        MAX(winning_amount / (10 ^ token_decimals)) as highest_reward
    FROM winners
    WHERE awarded_time > NOW() - i
    GROUP BY network, application;
$$;
DROP TABLE app_performance_return;

