-- migrate:up
CREATE OR REPLACE FUNCTION airdrop_leaderboard_update_static(epoch_ lootbox_epoch)
RETURNS VOID
AS $$
DECLARE
    result_record RECORD;
    result_cursor CURSOR FOR SELECT * FROM airdrop_leaderboard(epoch_);
BEGIN
    OPEN result_cursor;
    LOOP
        FETCH result_cursor INTO result_record;
        EXIT WHEN NOT FOUND;
    INSERT INTO airdrop_leaderboard_static_24_hours (
        address,
        referral_count,
        total_lootboxes,
        highest_reward_tier,
        liquidity_multiplier,
        fusdc_earned,
        fly_earned,
        fly_staked,
        last_updated,
        epoch
    ) VALUES (
        result_record.address,
        result_record.referral_count,
        result_record.total_lootboxes,
        result_record.highest_reward_tier,
        result_record.liquidity_multiplier,
        result_record.fusdc_earned,
        result_record.fly_earned,
        result_record.fly_staked,
        NOW(),
        epoch_
    )
	ON CONFLICT (address) DO UPDATE
		SET 
        referral_count = excluded.referral_count,
        total_lootboxes = excluded.total_lootboxes,
        highest_reward_tier = excluded.highest_reward_tier,
        liquidity_multiplier = excluded.liquidity_multiplier,
        fusdc_earned = excluded.fusdc_earned,
        fly_earned = excluded.fly_earned,
        fly_staked = excluded.fly_staked,
        last_updated = excluded.last_updated,
        epoch = excluded.epoch;
    END LOOP;
    CLOSE result_cursor;
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION airdrop_leaderboard_update_static_24_hours(epoch_ lootbox_epoch)
RETURNS VOID
AS $$
DECLARE
    result_record RECORD;
    result_cursor CURSOR FOR SELECT * FROM airdrop_leaderboard_24_hours(epoch_);
BEGIN
    OPEN result_cursor;
    LOOP
        FETCH result_cursor INTO result_record;
        EXIT WHEN NOT FOUND;
    INSERT INTO airdrop_leaderboard_static_24_hours (
        address,
        referral_count,
        total_lootboxes,
        highest_reward_tier,
        liquidity_multiplier,
        fusdc_earned,
        fly_earned,
        fly_staked,
        last_updated,
        epoch
    ) VALUES (
        result_record.address,
        result_record.referral_count,
        result_record.total_lootboxes,
        result_record.highest_reward_tier,
        result_record.liquidity_multiplier,
        result_record.fusdc_earned,
        result_record.fly_earned,
        result_record.fly_staked,
        NOW(),
        epoch_
    )
	ON CONFLICT (address) DO UPDATE
		SET 
        referral_count = excluded.referral_count,
        total_lootboxes = excluded.total_lootboxes,
        highest_reward_tier = excluded.highest_reward_tier,
        liquidity_multiplier = excluded.liquidity_multiplier,
        fusdc_earned = excluded.fusdc_earned,
        fly_earned = excluded.fly_earned,
        fly_staked = excluded.fly_staked,
        last_updated = excluded.last_updated,
        epoch = excluded.epoch;
    END LOOP;
    CLOSE result_cursor;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION airdrop_leaderboard_update_static_24_hours_by_application(epoch_ lootbox_epoch, application_ ethereum_application)
RETURNS VOID
AS $$
DECLARE
    result_record RECORD;
    result_cursor CURSOR FOR SELECT * FROM airdrop_leaderboard_24_hours_by_application(epoch_, application_);
BEGIN
    OPEN result_cursor;
    LOOP
        FETCH result_cursor INTO result_record;
        EXIT WHEN NOT FOUND;
    INSERT INTO airdrop_leaderboard_static_24_hours_by_application (
        address,
        referral_count,
        total_lootboxes,
        highest_reward_tier,
        liquidity_multiplier,
        fusdc_earned,
        fly_earned,
        fly_staked,
        last_updated,
        epoch
    ) VALUES (
        result_record.address,
        result_record.referral_count,
        result_record.total_lootboxes,
        result_record.highest_reward_tier,
        result_record.liquidity_multiplier,
        result_record.fusdc_earned,
        result_record.fly_earned,
        result_record.fly_staked,
        NOW(),
        epoch_
    )
	ON CONFLICT (address) DO UPDATE
		SET 
        referral_count = excluded.referral_count,
        total_lootboxes = excluded.total_lootboxes,
        highest_reward_tier = excluded.highest_reward_tier,
        liquidity_multiplier = excluded.liquidity_multiplier,
        fusdc_earned = excluded.fusdc_earned,
        fly_earned = excluded.fly_earned,
        fly_staked = excluded.fly_staked,
        last_updated = excluded.last_updated,
        epoch = excluded.epoch;
    END LOOP;
    CLOSE result_cursor;
END;
$$ LANGUAGE plpgsql;

-- migrate:down

DROP FUNCTION airdrop_leaderboard_update_static;
DROP FUNCTION airdrop_leaderboard_update_static_24_hours;
DROP FUNCTION airdrop_leaderboard_update_static_24_hours_by_application;
