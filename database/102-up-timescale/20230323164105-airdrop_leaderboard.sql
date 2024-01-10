--migrate:up
CREATE TABLE airdrop_leaderboard_return (
	address VARCHAR NOT NULL,
	rank BIGINT NOT NULL,
	referral_count BIGINT NOT NULL,
	total_lootboxes NUMERIC NOT NULL,
	highest_reward_tier INT NOT NULL,
	liquidity_multiplier NUMERIC NOT NULL
);

CREATE OR REPLACE FUNCTION airdrop_leaderboard()
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

--migrate:down

DROP FUNCTION airdrop_leaderboard;
DROP TABLE airdrop_leaderboard_return;
