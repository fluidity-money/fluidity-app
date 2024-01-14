-- migrate:up

DROP FUNCTION airdrop_leaderboard;

CREATE FUNCTION public.airdrop_leaderboard(epoch_ lootbox_epoch)
 RETURNS SETOF airdrop_leaderboard_return
 LANGUAGE sql
 STABLE
AS $function$
SELECT
    DISTINCT address,
    -- placeholder
    ROW_NUMBER() OVER () AS rank,
    COUNT(DISTINCT referee) AS referral_count,
    lb.total_box_count,
    lb.highest_reward_tier,
    COALESCE(liquidity.result, 1) AS liquidity_multiplier,
    COALESCE(lootbox_amounts_rewarded_fusdc.amount_earned, 0),
    COALESCE(lootbox_amounts_rewarded_arb.amount_earned, 0)
FROM (
    -- subquery to avoid re-summing lootbox_count for every referee
    SELECT address, SUM(lootbox_count) as total_box_count, MAX(reward_tier) as highest_reward_tier
    FROM lootbox
    WHERE epoch = epoch_
    GROUP BY address
) lb
    LEFT JOIN (
        SELECT amount_earned, winner
        FROM lootbox_amounts_rewarded
        WHERE token_short_name = 'USDC' AND epoch = epoch_
    ) AS lootbox_amounts_rewarded_fusdc ON lb.address = lootbox_amounts_rewarded_fusdc.winner
    LEFT JOIN (
        SELECT amount_earned, winner
        FROM lootbox_amounts_rewarded
        WHERE token_short_name = 'ARB' AND epoch = epoch_
    ) AS lootbox_amounts_rewarded_arb ON lb.address = lootbox_amounts_rewarded_arb.winner
    LEFT JOIN lootbox_referrals
        ON lb.address = lootbox_referrals.referrer,
    LATERAL calculate_a_y(address, now()::TIMESTAMP) AS liquidity
GROUP BY address, liquidity_multiplier, total_box_count, highest_reward_tier, lootbox_amounts_rewarded_fusdc.amount_earned, lootbox_amounts_rewarded_arb.amount_earned
$function$;

-- migrate:down

DROP FUNCTION airdrop_leaderboard;

CREATE FUNCTION public.airdrop_leaderboard(epoch_ lootbox_epoch)
 RETURNS SETOF airdrop_leaderboard_return
 LANGUAGE sql
 STABLE
AS $function$
SELECT
    address,
    -- placeholder
    ROW_NUMBER() OVER () AS rank,
    COUNT(DISTINCT referee) AS referral_count,
    lb.total_box_count,
    lb.highest_reward_tier,
    COALESCE(liquidity.result, 1) AS liquidity_multiplier,
    COALESCE(lootbox_amounts_rewarded_fusdc.amount_earned, 0),
    COALESCE(lootbox_amounts_rewarded_arb.amount_earned, 0)
FROM (
    -- subquery to avoid re-summing lootbox_count for every referee
    SELECT address, SUM(lootbox_count) as total_box_count, MAX(reward_tier) as highest_reward_tier
    FROM lootbox
    WHERE epoch = epoch_
    GROUP BY address
) lb
    LEFT JOIN (
        SELECT amount_earned, winner
        FROM lootbox_amounts_rewarded
        WHERE token_short_name = 'USDC'
    ) AS lootbox_amounts_rewarded_fusdc ON lb.address = lootbox_amounts_rewarded_fusdc.winner
    LEFT JOIN (
        SELECT amount_earned, winner
        FROM lootbox_amounts_rewarded
        WHERE token_short_name = 'ARB'
    ) AS lootbox_amounts_rewarded_arb ON lb.address = lootbox_amounts_rewarded_arb.winner
    LEFT JOIN lootbox_referrals
        ON lb.address = lootbox_referrals.referrer,
    LATERAL calculate_a_y(address, now()::TIMESTAMP) AS liquidity
GROUP BY address, liquidity_multiplier, total_box_count, highest_reward_tier, lootbox_amounts_rewarded_fusdc.amount_earned, lootbox_amounts_rewarded_arb.amount_earned
$function$;
