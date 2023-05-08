-- migrate:up
CREATE OR REPLACE FUNCTION airdrop_leaderboard_24_hours()
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
    SUM(lootbox_count) AS total_lootboxes, 
    MAX(reward_tier) AS highest_reward_tier, 
    COALESCE(liquidity.result, 1) AS liquidity_multiplier 
FROM lootbox 
    LEFT JOIN lootbox_referrals 
        ON lootbox.address = lootbox_referrals.referrer, 
    LATERAL calculate_a_y(address, now()::TIMESTAMP) AS liquidity 
WHERE awarded_time > now() - interval '1 day'
GROUP BY address, liquidity_multiplier
$$;

--migrate:down

DROP FUNCTION airdrop_leaderboard_24_hours;


