-- migrate:up

-- doesn't take the underlying network into account!

DROP FUNCTION airdrop_leaderboard_24_hours;

ALTER TABLE airdrop_leaderboard_return
	ADD COLUMN fusdc_earned DECIMAL NOT NULL,
	ADD COLUMN arb_earned DECIMAL NOT NULL;

CREATE OR REPLACE FUNCTION airdrop_leaderboard_24_hours(epoch_ lootbox_epoch)
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
    COALESCE(liquidity.result, 1) AS liquidity_multiplier,
    lootbox_amounts_rewarded_fusdc.amount_earned,
    lootbox_amounts_rewarded_arb.amount_earned
FROM (
    -- subquery to avoid re-summing lootbox_count for every referee
    SELECT address, SUM(lootbox_count) as total_box_count, MAX(reward_tier) as highest_reward_tier
    FROM lootbox
    WHERE awarded_time > now() - interval '1 day' AND epoch = epoch_
    GROUP BY address
) lb
    LEFT JOIN (
        SELECT amount_earned, recipient
        FROM lootbox_amounts_rewarded
        WHERE token_short_name = 'USDC'
    ) AS lootbox_amounts_rewarded_fusdc ON lb.address = lootbox_amounts_rewarded_fusdc.recipient
    LEFT JOIN (
        SELECT amount_earned, recipient
        FROM lootbox_amounts_rewarded
        WHERE token_short_name = 'ARB'
    ) AS lootbox_amounts_rewarded_arb ON lb.address = lootbox_amounts_rewarded_arb.recipient
    LEFT JOIN lootbox_referrals
        ON lb.address = lootbox_referrals.referrer,
    LATERAL calculate_a_y(address, now()::TIMESTAMP) AS liquidity
GROUP BY
    address,
    liquidity_multiplier,
    total_box_count,
    highest_reward_tier,
    lootbox_amounts_rewarded_fusdc.amount_earned,
    lootbox_amounts_rewarded_arb.amount_earned
$$;

-- migrate:down

DROP FUNCTION airdrop_leaderboard_24_hours;

ALTER TABLE airdrop_leaderboard_return
	DROP COLUMN fusdc_earned,
	DROP COLUMN arb_earned;

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
    lb.total_box_count,
    lb.highest_reward_tier,
    COALESCE(liquidity.result, 1) AS liquidity_multiplier
FROM (
    -- subquery to avoid re-summing lootbox_count for every referee
    SELECT address, SUM(lootbox_count) as total_box_count, MAX(reward_tier) as highest_reward_tier
    FROM lootbox
    WHERE awarded_time > now() - interval '1 day'
    GROUP BY address
) lb
    LEFT JOIN lootbox_referrals
        ON lb.address = lootbox_referrals.referrer,
    LATERAL calculate_a_y(address, now()::TIMESTAMP) AS liquidity
GROUP BY address, liquidity_multiplier, total_box_count, highest_reward_tier
$$;
