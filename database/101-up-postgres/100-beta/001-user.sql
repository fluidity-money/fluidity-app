-- migrate:up

-- users participating in the second stage of our beta

CREATE TABLE beta_user (
	primary_key BIGSERIAL PRIMARY KEY,

	-- user_id is the unique 6-character id / access token for a user

	user_id VARCHAR UNIQUE NOT NULL,

	-- address and private_key are hex encoded strings

	address VARCHAR NOT NULL,
	private_key VARCHAR NOT NULL,

	email VARCHAR NOT NULL,
	tickets_scored INTEGER NOT NULL,

	-- daily_quest_timer is a date in the future when a quest should become
	-- active again

	daily_quest_timer TIMESTAMP NOT NULL,
	created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

	-- oft-updated addresses of daily quests for users
	-- participating in the beta

	daily_quest_1_address VARCHAR NOT NULL,
	daily_quest_2_address VARCHAR NOT NULL,
	daily_quest_3_address VARCHAR NOT NULL,
	daily_quest_4_address VARCHAR NOT NULL,
	daily_quest_5_address VARCHAR NOT NULL,
	daily_quest_6_address VARCHAR NOT NULL,

	-- when a reset happens (daily_quest_timer passes) and a user has completed
	-- a daily quest, daily_streak should be incremented with a random number
	-- for each of the daily quests

	daily_streak INTEGER NOT NULL,
	faucet_timestamp TIMESTAMP NOT NULL
);

-- migrate:down
DROP TABLE IF EXISTS beta_user;

