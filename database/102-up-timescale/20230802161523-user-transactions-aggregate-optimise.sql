--migrate:up

-- function: select most recent 12 tx hashes from user_actions, aggregate (paid and pending) fluid/utility reward info for the dashboard to display
-- filter by address, limit, offset
-- n.b: chooses sender/receiver/amount from user_actions using DISTINCT, so if same tx hash has several user actions, it will use the first one
-- similarly coalesces winning address, reward hash, utility name
-- coalesces utilities, so e.g. FLUID 5, utility1 10, utility2 15 will become FLUID 5, utility1 25

-- https://wiki.postgresql.org/wiki/First/last_(aggregate)
-- Create a function that always returns the first non-NULL value:
CREATE OR REPLACE FUNCTION public.first_agg (anyelement, anyelement)
  RETURNS anyelement
  LANGUAGE sql IMMUTABLE STRICT PARALLEL SAFE AS
'SELECT $1';

-- Then wrap an aggregate around it:
CREATE AGGREGATE public.first (anyelement) (
  SFUNC    = public.first_agg
, STYPE    = anyelement
, PARALLEL = safe
);

DROP FUNCTION user_transactions_aggregate;

CREATE FUNCTION user_transactions_aggregate(network_ network_blockchain, filter_address VARCHAR DEFAULT NULL, limit_ INT DEFAULT 12, offset_ INT DEFAULT NULL)
RETURNS SETOF user_transactions_aggregate_return
LANGUAGE SQL
STABLE
AS
$$
SELECT
    'f' || token_short_name AS currency,
    (EXTRACT(EPOCH FROM time))::BIGINT AS time,
    amount / 10^token_decimals,
	-- display whether paid or pending
    COALESCE(winning_amount, pending_winning_amount, 0) AS winning_amount,
    COALESCE(utility_amount, pending_utility_amount, 0) AS utility_amount,
    COALESCE(fluid_reward_hash, utility_reward_hash, '') AS reward_hash, 
    COALESCE(utility_name, pending_utility_name) AS utility_name,
    COALESCE(
        fluid_winning_address, 
        utility_winning_address, 
        pending_fluid_winning_address, 
        pending_utility_winning_address,
		''
    ) AS winning_address,
    COALESCE(
        fluid_application, 
        utility_application, 
        pending_fluid_application, 
        pending_utility_application,
		''
    ) AS application,
    transaction_hash,
    sender_address,
    recipient_address 
FROM 
(
	-- user action by hash
    SELECT DISTINCT ON(user_actions.transaction_hash) 
        network,
        sender_address,
        recipient_address,
        amount,
        time,
        transaction_hash,
        token_short_name,
        token_decimals,
        application,
        fluid_reward_hash,
        fluid_winning_address,
        fluid_application,
        winning_amount,
        utility_reward_hash,
        utility_winning_address,
        utility_name,
        utility_application,
        utility_amount,
        pending_fluid_winning_address,
        pending_fluid_application,
        pending_winning_amount,
        pending_utility_winning_address,
        pending_utility_name,
        pending_utility_application,
        pending_utility_amount
        from user_actions
    /* FROM (select * from user_actions where network = network_ order by time desc limit limit_) user_actions */
	-- join fluid winners
    LEFT JOIN (
        SELECT
            -- take first value for reward hash, win address
            FIRST(transaction_hash) AS fluid_reward_hash,
            FIRST(winning_address) AS fluid_winning_address,
            FIRST(ethereum_application)::varchar AS fluid_application,
            send_transaction_hash, 
            SUM(winning_amount / 10^token_decimals) AS winning_amount
        FROM winners 
        WHERE utility_name = 'FLUID' 
        GROUP BY send_transaction_hash
    ) s ON user_actions.transaction_hash = send_transaction_hash
	-- join utility winners
    LEFT JOIN (
        SELECT 
            -- take first value for reward hash, win address, utility name
            FIRST(transaction_hash) AS utility_reward_hash,
            FIRST(winning_address) AS utility_winning_address,
            FIRST(utility_name) AS utility_name,
            FIRST(ethereum_application)::VARCHAR AS utility_application,
            send_transaction_hash,
            sum(winning_amount / 10^token_decimals) AS utility_amount 
        FROM winners
        WHERE utility_name != 'FLUID'
        GROUP BY send_transaction_hash
    ) w ON user_actions.transaction_hash = w.send_transaction_hash
    -- join pending winners
    LEFT JOIN (
        SELECT 
            -- take first value for win address
            FIRST(address) AS pending_fluid_winning_address,
            FIRST(application) AS pending_fluid_application,
            transaction_hash AS pending_tx_hash,
            sum(win_amount / 10^token_decimals) AS pending_winning_amount
        FROM ethereum_pending_winners 
        WHERE reward_sent = FALSE AND utility_name = 'FLUID' 
        GROUP BY transaction_hash
    ) epw ON user_actions.transaction_hash = epw.pending_tx_hash
    -- join pending utility winners
    LEFT JOIN (
        SELECT 
            -- take first value for win address, utility name
            FIRST(address) AS pending_utility_winning_address,
            FIRST(utility_name) AS pending_utility_name,
            FIRST(application) AS pending_utility_application,
            transaction_hash AS pending_tx_hash, 
            SUM(win_amount / 10^token_decimals) AS pending_utility_amount
        FROM ethereum_pending_winners 
        WHERE reward_sent = FALSE AND utility_name != 'FLUID'
        GROUP BY transaction_hash
    ) epwu ON user_actions.transaction_hash = epwu.pending_tx_hash
) s  
WHERE network = network_
    AND (filter_address IS null OR sender_address = filter_address OR recipient_address = filter_address)
ORDER BY time DESC LIMIT limit_ OFFSET offset_;
$$;

-- create an index to speed up user action filtering/joins
CREATE INDEX user_actions_tx_hash_index ON user_actions(transaction_hash);

--migrate:down

DROP AGGREGATE first(anyelement);
DROP FUNCTION first_agg;

DROP INDEX user_actions_tx_hash_index;

-- restore previous definition
DROP FUNCTION user_transactions_aggregate;
CREATE FUNCTION user_transactions_aggregate(network_ network_blockchain, filter_address VARCHAR DEFAULT NULL, limit_ INT DEFAULT 12, offset_ INT DEFAULT NULL)
RETURNS SETOF user_transactions_aggregate_return
LANGUAGE SQL
STABLE
AS
$$
SELECT
    'f' || token_short_name AS currency,
    (EXTRACT(EPOCH FROM time))::BIGINT AS time,
    amount / 10^token_decimals,
	-- display whether paid or pending
    COALESCE(winning_amount, pending_winning_amount, 0) AS winning_amount,
    COALESCE(utility_amount, pending_utility_amount, 0) AS utility_amount,
    COALESCE(fluid_reward_hash, utility_reward_hash, '') AS reward_hash, 
    COALESCE(utility_name, pending_utility_name) AS utility_name,
    COALESCE(
        fluid_winning_address, 
        utility_winning_address, 
        pending_fluid_winning_address, 
        pending_utility_winning_address,
		''
    ) AS winning_address,
    COALESCE(
        fluid_application, 
        utility_application, 
        pending_fluid_application, 
        pending_utility_application,
		''
    ) AS application,
    transaction_hash,
    sender_address,
    recipient_address 
FROM 
(
	-- user action by hash
    SELECT DISTINCT ON(user_actions.transaction_hash) 
        network,
        sender_address,
        recipient_address,
        amount,
        time,
        transaction_hash,
        token_short_name,
        token_decimals,
        application,
        fluid_reward_hash,
        fluid_winning_address,
        fluid_application,
        winning_amount,
        utility_reward_hash,
        utility_winning_address,
        utility_name,
        utility_application,
        utility_amount,
        pending_fluid_winning_address,
        pending_fluid_application,
        pending_winning_amount,
        pending_utility_winning_address,
        pending_utility_name,
        pending_utility_application,
        pending_utility_amount
    FROM user_actions 
	-- join fluid winners
    LEFT JOIN (
        SELECT
			-- take first value for reward hash, win address
            (array_agg(DISTINCT(transaction_hash)))[1] AS fluid_reward_hash,
            (array_agg(DISTINCT(winning_address)))[1] AS fluid_winning_address,
            (array_agg(DISTINCT(ethereum_application)))[1]::VARCHAR AS fluid_application,
            send_transaction_hash, 
            SUM(winning_amount / 10^token_decimals) AS winning_amount
        FROM winners 
        WHERE utility_name = 'FLUID' 
        GROUP BY send_transaction_hash
    ) s ON user_actions.transaction_hash = send_transaction_hash
	-- join utility winners
    LEFT JOIN (
        SELECT 
			-- take first value for reward hash, win address, utility name
            (array_agg(DISTINCT(transaction_hash)))[1] AS utility_reward_hash,
            (array_agg(DISTINCT(winning_address)))[1] AS utility_winning_address,
            (array_agg(DISTINCT(utility_name)))[1] AS utility_name,
            (array_agg(DISTINCT(ethereum_application)))[1]::VARCHAR AS utility_application,
            send_transaction_hash,
            sum(winning_amount / 10^token_decimals) AS utility_amount 
        FROM winners
        WHERE utility_name != 'FLUID'
        GROUP BY send_transaction_hash
    ) w ON user_actions.transaction_hash = w.send_transaction_hash
    -- join pending winners
    LEFT JOIN (
        SELECT 
            -- take first value for win address
            (array_agg(DISTINCT(address)))[1] AS pending_fluid_winning_address,
            (array_agg(DISTINCT(application)))[1] AS pending_fluid_application,
            transaction_hash AS pending_tx_hash,
            sum(win_amount / 10^token_decimals) AS pending_winning_amount
        FROM ethereum_pending_winners 
        WHERE reward_sent = FALSE AND utility_name = 'FLUID' 
        GROUP BY transaction_hash
    ) epw ON user_actions.transaction_hash = epw.pending_tx_hash
    -- join pending utility winners
    LEFT JOIN (
        SELECT 
            -- take first value for win address, utility name
            (array_agg(DISTINCT(address)))[1] AS pending_utility_winning_address,
            (array_agg(DISTINCT(utility_name)))[1] AS pending_utility_name,
            (array_agg(DISTINCT(application)))[1] AS pending_utility_application,
            transaction_hash AS pending_tx_hash, 
            SUM(win_amount / 10^token_decimals) AS pending_utility_amount
        FROM ethereum_pending_winners 
        WHERE reward_sent = FALSE AND utility_name != 'FLUID'
        GROUP BY transaction_hash
    ) epwu ON user_actions.transaction_hash = epwu.pending_tx_hash
) s  
WHERE network = network_
    AND (filter_address IS null OR sender_address = filter_address OR recipient_address = filter_address)
ORDER BY time DESC LIMIT limit_ OFFSET offset_;
$$;
