
-- migrate:up

-- a snapshot of the return value of airdrop_leaderboard taken on a regular interval to avoid database load
CREATE TABLE airdrop_leaderboard_static (
	address VARCHAR UNIQUE NOT NULL,
	referral_count BIGINT NOT NULL,
	total_lootboxes NUMERIC NOT NULL,
	highest_reward_tier INTEGER NOT NULL,
	liquidity_multiplier NUMERIC NOT NULL,
	fusdc_earned NUMERIC NOT NULL,
	fly_earned NUMERIC NOT NULL,
	fly_staked NUMERIC NOT NULL,
	last_updated TIMESTAMP NOT NULL,
	epoch lootbox_epoch NOT NULL
);

CREATE TABLE airdrop_leaderboard_static_24_hours (
	address VARCHAR UNIQUE NOT NULL,
	referral_count BIGINT NOT NULL,
	total_lootboxes NUMERIC NOT NULL,
	highest_reward_tier INTEGER NOT NULL,
	liquidity_multiplier NUMERIC NOT NULL,
	fusdc_earned NUMERIC NOT NULL,
	fly_earned NUMERIC NOT NULL,
	fly_staked NUMERIC NOT NULL,
	last_updated TIMESTAMP NOT NULL,
	epoch lootbox_epoch NOT NULL
);

CREATE TABLE airdrop_leaderboard_static_24_hours_by_application (
	address VARCHAR UNIQUE NOT NULL,
	referral_count BIGINT NOT NULL,
	total_lootboxes NUMERIC NOT NULL,
	highest_reward_tier INTEGER NOT NULL,
	liquidity_multiplier NUMERIC NOT NULL,
	fusdc_earned NUMERIC NOT NULL,
	fly_earned NUMERIC NOT NULL,
	fly_staked NUMERIC NOT NULL,
	last_updated TIMESTAMP NOT NULL,
	epoch lootbox_epoch NOT NULL,
	application ethereum_application NOT NULL
);

-- migrate:down

DROP TABLE airdrop_leaderboard_static;
DROP TABLE airdrop_leaderboard_static_24_hours;
DROP TABLE airdrop_leaderboard_static_24_hours_by_application;
