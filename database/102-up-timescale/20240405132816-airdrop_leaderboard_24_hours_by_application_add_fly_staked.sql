-- migrate:up

DROP FUNCTION airdrop_leaderboard_24_hours_by_application;

ALTER TABLE airdrop_leaderboard_return
	ADD COLUMN fly_staked DECIMAL;

CREATE FUNCTION airdrop_leaderboard_24_hours_by_application(epoch_ lootbox_epoch, application_ ethereum_application)
RETURNS SETOF airdrop_leaderboard_return
LANGUAGE SQL
STABLE
AS
$$
SELECT
    DISTINCT lb_24_application.address as address,
    ROW_NUMBER() OVER () AS rank,
    COUNT(DISTINCT referee) AS referral_count,
    lb_24_application.total_box_count,
    lb_24_application.highest_reward_tier,
    COALESCE(liquidity.result, 1) AS liquidity_multiplier,
    COALESCE(lootbox_amounts_rewarded_fusdc.amount_earned, 0),
    COALESCE(lootbox_amounts_rewarded_fly.amount_earned, 0),
    fly_staked.amount AS fly_staked
FROM (
    -- subquery to avoid re-summing lootbox_count for every referee
    SELECT address, SUM(lootbox_count) as total_box_count, MAX(reward_tier) as highest_reward_tier
    FROM lootbox
    WHERE awarded_time > now() - interval '1 day' AND epoch = epoch_
    AND application = application_
    GROUP BY address
) lb_24_application
    LEFT JOIN (
        SELECT amount_earned, winner
        FROM lootbox_amounts_rewarded
        WHERE token_short_name = 'USDC'
    ) AS lootbox_amounts_rewarded_fusdc ON lb_24_application.address = lootbox_amounts_rewarded_fusdc.winner
    LEFT JOIN (
        SELECT amount_earned, winner
        FROM lootbox_amounts_rewarded
        WHERE token_short_name = 'FLY'
    ) AS lootbox_amounts_rewarded_fly ON lb_24_application.address = lootbox_amounts_rewarded_fly.winner
    LEFT JOIN lootbox_referrals
        ON lb_24_application.address = lootbox_referrals.referrer
    LEFT JOIN fly_staked
        ON lb_24_application.address = fly_staked.address,
    LATERAL calculate_a_y(lb_24_application.address, now()::TIMESTAMP) AS liquidity
GROUP BY
    lb_24_application.address,
    liquidity_multiplier,
    total_box_count,
    highest_reward_tier,
    lootbox_amounts_rewarded_fusdc.amount_earned,
    lootbox_amounts_rewarded_fly.amount_earned,
    fly_staked.address,
    fly_staked.amount
$$;

-- migrate:down

DROP FUNCTION airdrop_leaderboard_24_hours_by_application;

CREATE FUNCTION airdrop_leaderboard_24_hours_by_application(epoch_ lootbox_epoch, application_ ethereum_application)
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
    COALESCE(liquidity.result, 1) AS liquidity_multiplier,
    COALESCE(lootbox_amounts_rewarded_fusdc.amount_earned, 0),
    COALESCE(lootbox_amounts_rewarded_arb.amount_earned, 0)
FROM (
    -- subquery to avoid re-summing lootbox_count for every referee
    SELECT address, SUM(lootbox_count) as total_box_count, MAX(reward_tier) as highest_reward_tier
    FROM lootbox
    WHERE awarded_time > now() - interval '1 day' AND epoch = epoch_
    AND application = application_
    GROUP BY address
) lb_24_application
    LEFT JOIN (
        SELECT amount_earned, winner
        FROM lootbox_amounts_rewarded
        WHERE token_short_name = 'USDC'
    ) AS lootbox_amounts_rewarded_fusdc ON lb_24_application.address = lootbox_amounts_rewarded_fusdc.winner
    LEFT JOIN (
        SELECT amount_earned, winner
        FROM lootbox_amounts_rewarded
        WHERE token_short_name = 'ARB'
    ) AS lootbox_amounts_rewarded_arb ON lb_24_application.address = lootbox_amounts_rewarded_arb.winner
    LEFT JOIN lootbox_referrals
        ON lb_24_application.address = lootbox_referrals.referrer,
    LATERAL calculate_a_y(address, now()::TIMESTAMP) AS liquidity
GROUP BY
    address,
    liquidity_multiplier,
    total_box_count,
    highest_reward_tier,
    lootbox_amounts_rewarded_fusdc.amount_earned,
    lootbox_amounts_rewarded_arb.amount_earned
$$;
