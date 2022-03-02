
-- reusable datatypes across the postgres/timescale relations
-- since the backend's the same.

CREATE DOMAIN uint256 NUMERIC(78, 0);

-- add the current blobkchain backends that we support, ethereum and solana

CREATE TYPE network_blockchain AS ENUM (
	'ethereum',
	'solana'
);

-- user action taken by the user

CREATE TYPE user_action AS ENUM (
	'swap',
	'send'
);

-- questions received by faucet.fluidity.money

CREATE TABLE website_questions (
	primary_key BIGSERIAL PRIMARY KEY,

	-- name is the name of the question submitter

	name VARCHAR NOT NULL,

	-- email is the email of the question submitter

	email VARCHAR NOT NULL,

	-- question is the question content that they submitted

	question CHAR(500) NOT NULL
);

CREATE TYPE website_source AS ENUM (
	'landing',
	'faucet'
);

ALTER TABLE website_questions
	ADD COLUMN source website_source NOT NULL;

-- add support for taking signups

CREATE TABLE website_subscriptions (
	primary_key BIGSERIAL PRIMARY KEY,

	-- email used to sign up with a subscription

	email VARCHAR NOT NULL,

	-- source that the user used to submit a subscription

	source website_source NOT NULL
);

-- prize pool of the current amount that's available to win

CREATE TABLE prize_pool (
	amount uint256 NOT NULL,
	last_updated TIMESTAMP NOT NULL
);

-- add the network and the contract address to the prize pool

ALTER TABLE prize_pool ADD
	network network_blockchain NOT NULL;

ALTER TABLE prize_pool ADD
	contract_address VARCHAR NOT NULL;

-- update the prize pool container to use floats instead for the prize
-- pool amount so we can aggregate and do conversions to USDT in the backend

BEGIN;

UPDATE prize_pool SET amount = amount / 1e6;

ALTER TABLE prize_pool ALTER COLUMN amount TYPE FLOAT;

COMMIT;

-- remove the contract field in the database

ALTER TABLE prize_pool DROP COLUMN contract;

CREATE TABLE faucet_users (

	address VARCHAR NOT NULL,

	unique_address VARCHAR NOT NULL,

	ip_address VARCHAR NOT NULL,

	network network_blockchain NOT NULL,

	last_used TIMESTAMP
);

-- init creates codependent generic tables without any of the size
-- considerations

CREATE TABLE ethereum_block_headers (
	parent_hash VARCHAR NOT NULL,
	uncle_hash VARCHAR NOT NULL,
	coinbase VARCHAR NOT NULL,
	root VARCHAR NOT NULL,
	transaction_hash VARCHAR NOT NULL,
	bloom VARCHAR NOT NULL,
	difficulty uint256 NOT NULL,
	number BIGINT NOT NULL,
	gas_limit uint256 NOT NULL,
	time TIMESTAMP NOT NULL,
	extra VARCHAR NOT NULL,
	mix_digest VARCHAR NOT NULL,
	nonce BIGINT NOT NULL,
	base_fee uint256 NOT NULL
);

CREATE TABLE ethereum_blocks (

	-- block_hash is the hash of the block, used by ethereum_transactions
	-- to identify the parent of the transaction.

	block_hash VARCHAR NOT NULL,

	base_fee uint256 NOT NULL,

	-- transactions are not included here, use the block_hash to search in
	-- ethereum_transactions

	coinbase VARCHAR NOT NULL,
	difficulty uint256 NOT NULL,
	extra VARCHAR NOT NULL,
	hash VARCHAR NOT NULL,

	-- block_header is not included here, use the block_hash to find headers

	mix_digest VARCHAR NOT NULL,
	number BIGINT NOT NULL,
	parent_hash VARCHAR NOT NULL,
	receipt_hash VARCHAR NOT NULL,
	root VARCHAR NOT NULL,
	size BIGINT NOT NULL,
	time TIMESTAMP NOT NULL,
	transaction_hash VARCHAR NOT NULL,

	-- uncles is not included

	uncle_hash VARCHAR NOT NULL
);

CREATE TABLE ethereum_transactions (

	-- block_hash is the block that originated this transaction

	block_hash VARCHAR NOT NULL,

	chain_id INTEGER NOT NULL,
	cost uint256 NOT NULL,
	data VARCHAR NOT NULL,
	gas uint256 NOT NULL,
	gas_fee_cap uint256 NOT NULL,
	gas_price uint256 NOT NULL,
	hash VARCHAR NOT NULL,
	nonce BIGINT NOT NULL,
	to_ VARCHAR NOT NULL,
	from_ VARCHAR NOT NULL,
	type INTEGER NOT NULL,
	value uint256 NOT NULL
);

-- add Ethereum logs and topics as separate tables

CREATE TABLE ethereum_logs (
	address VARCHAR NOT NULL,
	data VARCHAR NOT NULL,
	block_number BIGINT NOT NULL,
	transaction_hash VARCHAR NOT NULL,
	transaction_index INTEGER NOT NULL,

	-- block_hash that contains the
	block_hash VARCHAR NOT NULL,

	-- the index of the log within the block
	index INTEGER NOT NULL,

	-- topics in the log are unrolled and inserted here

	topic_1 VARCHAR NOT NULL,
	topic_2 VARCHAR,
	topic_3 VARCHAR,
	topic_4 VARCHAR
);

-- add a timestamp to each of the records to track their creation

-- at the time of writing, the created_timestamp isn't supported in any of
-- the types in microservice-lib

ALTER TABLE ethereum_block_headers ADD
	created_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE ethereum_blocks ADD
	created_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE ethereum_logs ADD
	created_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE ethereum_transactions ADD
	created_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

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

ALTER TABLE beta_user
	ADD daily_quest_1_completed BOOLEAN NOT NULL,
	ADD daily_quest_2_completed BOOLEAN NOT NULL,
	ADD daily_quest_3_completed BOOLEAN NOT NULL,
	ADD daily_quest_4_completed BOOLEAN NOT NULL,
	ADD daily_quest_5_completed BOOLEAN NOT NULL,
	ADD daily_quest_6_completed BOOLEAN NOT NULL;

-- a list of quests that can be assigned to users to complete in the beta

CREATE TABLE quests (

    primary_key BIGSERIAL PRIMARY KEY NOT NULL,

    -- address is the address of the quest contract

    address VARCHAR UNIQUE NOT NULL
);
