-- migrate:up

CREATE OR REPLACE FUNCTION protocol_multiplier(application ethereum_application)
RETURNS NUMERIC
LANGUAGE SQL
STABLE
AS
$$
SELECT
    CASE
        WHEN application = 'curve' THEN 2
        WHEN application = 'saddle' THEN 2
        WHEN application = 'sushiswap' THEN 2
        WHEN application = 'uniswap_v2' THEN 2
        WHEN application = 'uniswap_v3' THEN 2
        ELSE 1.0/3
    END
$$;

CREATE OR REPLACE FUNCTION airdrop_leaderboard_24_hours_by_application(application_ ethereum_application)
RETURNS SETOF airdrop_leaderboard_return
LANGUAGE SQL
STABLE
AS
$$
SELECT
    address,
    -- placeholder
    ROW_NUMBER() OVER () AS rank,
    COUNT(DISTINCT referee) AS referral_count,
    lb_24_application.total_box_count,
    lb_24_application.highest_reward_tier,
    COALESCE(liquidity.result, 1) AS liquidity_multiplier
FROM (
    -- subquery to avoid re-summing lootbox_count for every referee
    SELECT address, SUM(lootbox_count) as total_box_count, MAX(reward_tier) as highest_reward_tier
    FROM lootbox
    WHERE awarded_time > now() - interval '1 day'
    AND application = application_
    GROUP BY address
) lb_24_application
    LEFT JOIN lootbox_referrals
        ON lb_24_application.address = lootbox_referrals.referrer,
    LATERAL calculate_a_y(address, now()::TIMESTAMP) AS liquidity
GROUP BY address, liquidity_multiplier, total_box_count, highest_reward_tier
$$;


-- migrate:down

DROP FUNCTION airdrop_leaderboard_24_hours_by_application;

CREATE OR REPLACE FUNCTION protocol_multiplier(application ethereum_application)
RETURNS NUMERIC
LANGUAGE SQL
STABLE
AS
$$
SELECT
    CASE
        WHEN application = 'uniswap_v2' THEN 2
        WHEN application = 'uniswap_v3' THEN 2
        WHEN application = 'saddle' THEN 2
        WHEN application = 'curve' THEN 2
        ELSE 1.0/3
    END
$$;
