--migrate:up
CREATE TABLE airdrop_leaderboard_return (
	address VARCHAR NOT NULL,
	rank BIGINT NOT NULL,
	referral_count BIGINT NOT NULL,
	total_lootboxes NUMERIC NOT NULL,
	highest_reward_tier INT NOT NULL,
	liquidity_multiplier NUMERIC NOT NULL
);

DROP FUNCTION airdrop_leaderboard;

CREATE FUNCTION airdrop_leaderboard()
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
    lb.total_box_count,
    lb.highest_reward_tier, 
    COALESCE(liquidity.result, 1) AS liquidity_multiplier 
FROM (
    -- subquery to avoid re-summing lootbox_count for every referee
    SELECT address, SUM(lootbox_count) as total_box_count, MAX(reward_tier) as highest_reward_tier
    FROM lootbox 
    GROUP BY address
) lb
    JOIN lootbox_referrals 
        ON lb.address = lootbox_referrals.referrer, 
    LATERAL calculate_a_y(address, now()::TIMESTAMP) AS liquidity 
GROUP BY address, liquidity_multiplier, total_box_count, highest_reward_tier
$$;

--migrate:down

DROP FUNCTION airdrop_leaderboard;
CREATE FUNCTION airdrop_leaderboard()
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
GROUP BY address, liquidity_multiplier
$$;
DROP TABLE airdrop_leaderboard_return;
