-- migrate:up

DROP FUNCTION user_transactions_aggregate;

CREATE FUNCTION user_transactions_aggregate(network_ network_blockchain, filter_address VARCHAR DEFAULT NULL, token VARCHAR DEFAULT NULL, limit_ INT DEFAULT 12, offset_ INT DEFAULT NULL)
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
        NULLIF(fluid_solana_winning_owner_address, ''),
        NULLIF(utility_solana_winning_owner_address, ''),
        fluid_winning_address, 
        utility_winning_address, 
        pending_fluid_winning_address, 
        pending_utility_winning_address,
		''
    ) AS winning_address,
    -- NULLIF in order to prefer showing an application if one exists in any log
    COALESCE(
        NULLIF(ethereum_fluid_application, 'none'), 
        NULLIF(solana_fluid_application, 'none'),
        NULLIF(ethereum_utility_application, 'none'),
        NULLIF(solana_utility_application, 'none'),
        NULLIF(pending_fluid_application, 'none'), 
        NULLIF(pending_utility_application, 'none'),
        NULLIF(application, 'none'),
		''
    ) AS application,
    transaction_hash,
    COALESCE(
		NULLIF(solana_sender_owner_address, ''), 
		sender_address
	) AS sender_address,
    COALESCE(
		NULLIF(solana_recipient_owner_address, ''), 
		recipient_address
	) AS recipient_address,
    type,
    swap_in
FROM 
(
	-- user action by hash
    SELECT DISTINCT ON(user_actions.transaction_hash) 
        network,
        sender_address,
        recipient_address,
        solana_sender_owner_address,
        solana_recipient_owner_address,
        amount,
        time,
        transaction_hash,
        token_short_name,
        token_decimals,
        application,
        fluid_reward_hash,
        fluid_winning_address,
        fluid_solana_winning_owner_address,
        ethereum_fluid_application,
        solana_fluid_application,
        winning_amount,
        utility_reward_hash,
        utility_winning_address,
        utility_solana_winning_owner_address,
        utility_name,
        ethereum_utility_application,
        solana_utility_application,
        utility_amount,
        pending_fluid_winning_address,
        pending_fluid_application,
        pending_winning_amount,
        pending_utility_winning_address,
        pending_utility_name,
        pending_utility_application,
        pending_utility_amount,
        swap_in,
        type
        from user_actions
    /* FROM (select * from user_actions where network = network_ order by time desc limit limit_) user_actions */
	-- join fluid winners
    LEFT JOIN (
        SELECT
            -- take first value for reward hash, win address
            FIRST(transaction_hash) AS fluid_reward_hash,
            FIRST(winning_address) AS fluid_winning_address,
            FIRST(solana_winning_owner_address) AS fluid_solana_winning_owner_address,
            FIRST(ethereum_application)::VARCHAR AS ethereum_fluid_application,
            FIRST(solana_application)::VARCHAR AS solana_fluid_application,
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
            FIRST(solana_winning_owner_address) AS utility_solana_winning_owner_address,
            FIRST(utility_name) AS utility_name,
            FIRST(ethereum_application)::VARCHAR AS ethereum_utility_application,
            FIRST(solana_application)::VARCHAR AS solana_utility_application,
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
    AND (token IS NULL OR token_short_name = token)
ORDER BY time DESC LIMIT limit_ OFFSET offset_;
$$;

-- migrate:down

-- restore previous definition
DROP FUNCTION user_transactions_aggregate;

CREATE FUNCTION user_transactions_aggregate(network_ network_blockchain, filter_address VARCHAR DEFAULT NULL, token VARCHAR DEFAULT NULL, limit_ INT DEFAULT 12, offset_ INT DEFAULT NULL)
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
        NULLIF(fluid_solana_winning_owner_address, ''),
        NULLIF(utility_solana_winning_owner_address, ''),
        fluid_winning_address, 
        utility_winning_address, 
        pending_fluid_winning_address, 
        pending_utility_winning_address,
		''
    ) AS winning_address,
    COALESCE(
        ethereum_fluid_application, 
        solana_fluid_application, 
        ethereum_utility_application, 
        solana_utility_application, 
        pending_fluid_application, 
        pending_utility_application,
		''
    ) AS application,
    transaction_hash,
    COALESCE(
		NULLIF(solana_sender_owner_address, ''), 
		sender_address
	) AS sender_address,
    COALESCE(
		NULLIF(solana_recipient_owner_address, ''), 
		recipient_address
	) AS recipient_address,
    type,
    swap_in
FROM 
(
	-- user action by hash
    SELECT DISTINCT ON(user_actions.transaction_hash) 
        network,
        sender_address,
        recipient_address,
        solana_sender_owner_address,
        solana_recipient_owner_address,
        amount,
        time,
        transaction_hash,
        token_short_name,
        token_decimals,
        application,
        fluid_reward_hash,
        fluid_winning_address,
        fluid_solana_winning_owner_address,
        ethereum_fluid_application,
        solana_fluid_application,
        winning_amount,
        utility_reward_hash,
        utility_winning_address,
        utility_solana_winning_owner_address,
        utility_name,
        ethereum_utility_application,
        solana_utility_application,
        utility_amount,
        pending_fluid_winning_address,
        pending_fluid_application,
        pending_winning_amount,
        pending_utility_winning_address,
        pending_utility_name,
        pending_utility_application,
        pending_utility_amount,
        swap_in,
        type
        from user_actions
    /* FROM (select * from user_actions where network = network_ order by time desc limit limit_) user_actions */
	-- join fluid winners
    LEFT JOIN (
        SELECT
            -- take first value for reward hash, win address
            FIRST(transaction_hash) AS fluid_reward_hash,
            FIRST(winning_address) AS fluid_winning_address,
            FIRST(solana_winning_owner_address) AS fluid_solana_winning_owner_address,
            FIRST(ethereum_application)::VARCHAR AS ethereum_fluid_application,
            FIRST(solana_application)::VARCHAR AS solana_fluid_application,
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
            FIRST(solana_winning_owner_address) AS utility_solana_winning_owner_address,
            FIRST(utility_name) AS utility_name,
            FIRST(ethereum_application)::VARCHAR AS ethereum_utility_application,
            FIRST(solana_application)::VARCHAR AS solana_utility_application,
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
    AND (token IS NULL OR token_short_name = token)
ORDER BY time DESC LIMIT limit_ OFFSET offset_;
$$;
