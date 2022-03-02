
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

CREATE TABLE worker_buffered_atx (
	block_number BIGINT NOT NULL,
	transaction_count INTEGER NOT NULL
);

ALTER TABLE worker_buffered_atx
	ADD COLUMN network network_blockchain NOT NULL;

ALTER TABLE worker_buffered_atx
	ADD COLUMN token_short_name VARCHAR NOT NULL DEFAULT 'USDC';

-- winners that were paid out in the past,

CREATE TABLE winners (
	network network_blockchain NOT NULL,
	transaction_hash VARCHAR NOT NULL,
	winning_address VARCHAR NOT NULL,
	winning_amount uint256 NOT NULL,

	-- the timestamp for when this was won
	awarded_time TIMESTAMP NOT NULL,

	created TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- add token details to make it easier to track winners that happen and
-- their token name/decimal conversions. set the existing decimals to 6
-- and the existing the

BEGIN;

ALTER TABLE winners ADD token_short_name VARCHAR;

ALTER TABLE winners ADD token_decimals INT;

UPDATE winners SET token_short_name = 'USDT';

UPDATE winners SET token_decimals = 6;

ALTER TABLE winners ALTER COLUMN token_short_name SET NOT NULL;

ALTER TABLE winners ALTER COLUMN token_decimals SET NOT NULL;

COMMIT;

ALTER TABLE winners
	ADD COLUMN solana_winning_owner_address VARCHAR NOT NULL;

-- user_actions is a high level representation of the user's actions
-- (swapping, sending) in the same table.

-- currently only USDT!

CREATE TABLE user_actions (
	-- event_number is useful with a graph database
	event_number BIGSERIAL NOT NULL,

	network network_blockchain NOT NULL,

	-- was this a send or a swap?
	type user_action NOT NULL,

	-- if the token was a swap into a Fluid Asset (if false, it was a
	-- swap out!)

	swap_in BOOLEAN,

	-- sender_address is the instigator of the action
	sender_address VARCHAR NOT NULL,

	-- if someone received this, may be NULL (if a swap!)
	recipient_address VARCHAR,

	-- amount that was sent/swapped
	amount uint256 NOT NULL,

	-- time that this transaction took place, may be null or set by
	-- the worker!
	time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE user_actions
	ADD COLUMN transaction_hash VARCHAR NOT NULL;

-- start tracking token details in the user actions, set the existing rows
-- to 6 due to them being USDT with a transaction

BEGIN;

ALTER TABLE user_actions ADD token_short_name VARCHAR;

ALTER TABLE user_actions ADD token_decimals INT;

UPDATE user_actions SET token_short_name = 'USDT';

UPDATE user_actions SET token_decimals = 6;

ALTER TABLE user_actions ALTER COLUMN token_short_name SET NOT NULL;

ALTER TABLE user_actions ALTER COLUMN token_decimals SET NOT NULL;

COMMIT;

ALTER TABLE user_actions
    ADD COLUMN solana_sender_owner_address VARCHAR,
    ADD COLUMN solana_recipient_owner_address VARCHAR;
-- tvl records the total value locked in the contract

CREATE TABLE tvl (
    -- total value locked, in the contract's units
    tvl UINT256 NOT NULL,

    contract_address VARCHAR NOT NULL,

    network network_blockchain NOT NULL,

    -- time this tvl was recorded
    time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- high level representation of past winners aggregated per day per month

CREATE TABLE past_winnings (
	winning_date DATE NOT NULL,
	amount_of_winners uint256 NOT NULL,
	winning_amount uint256 NOT NULL
);

-- add the network identifier

ALTER TABLE past_winnings
	ADD COLUMN network network_blockchain NOT NULL;

-- make the winning_date unique so as to prevent mistakes happening on the
-- cronjob that's responsible for this with weird timing

ALTER TABLE past_winnings
	ADD CONSTRAINT winning_date_unique UNIQUE (winning_date, network);

CREATE TABLE ethereum_erc20_transfers (
	contract_address VARCHAR NOT NULL,
	from_address VARCHAR NOT NULL,
	to_address VARCHAR NOT NULL,
	amount uint256 NOT NULL,
	picked_up TIMESTAMP NOT NULL,
	transaction_hash VARCHAR NOT NULL
);

CREATE TABLE compound_comptroller_market_listed (
	network INTEGER NOT NULL,
	transaction_hash VARCHAR NOT NULL,
	block_hash VARCHAR NOT NULL,
	picked_up TIMESTAMP NOT NULL,

	token_address VARCHAR NOT NULL
);

CREATE TABLE compound_ctoken_accrue_interest (
	network INTEGER NOT NULL,
	transaction_hash VARCHAR NOT NULL,
	block_hash VARCHAR NOT NULL,
	picked_up TIMESTAMP NOT NULL,

	cash_prior uint256 NOT NULL,
	interest_accumulated BIGINT NOT NULL,
	borrow_index BIGINT NOT NULL,
	total_borrows BIGINT NOT NULL
);

-- transaction that we track for the second stage of the beta in its
-- unique format

CREATE TABLE beta_transactions (
	transaction_hash VARCHAR NOT NULL,
	block_hash VARCHAR NOT NULL,
	from_address VARCHAR NOT NULL,
	to_address VARCHAR NOT NULL,
	contract_call BOOLEAN NOT NULL,
	was_winning BOOLEAN NOT NULL
);

-- a winning beta transaction, an almost-identical clone of the beta
-- transaction. both should be written in the event of a win.

CREATE TABLE beta_winning_transactions (
	transaction_hash VARCHAR NOT NULL,
	from_address VARCHAR NOT NULL,
	to_address VARCHAR NOT NULL,
	contract_call BOOLEAN NOT NULL,
	receiver_win_amount uint256 NOT NULL,
	sender_win_amount uint256 NOT NULL
);

-- completed beta quests, a write-only log of the quests that users have
-- finished

CREATE TABLE beta_completed_quests (

	-- the user's user id, stored in a separate table in
	-- postgres. (beta_user.user_id).

	beta_user_user_id VARCHAR NOT NULL,

	recipient_address VARCHAR NOT NULL,

	time TIMESTAMP NOT NULL
);

-- win log contains information from the rng microservice

CREATE TABLE beta_win_logs (
    block_hash VARCHAR NOT NULL,
    transaction_index DECIMAL NOT NULL,
    win_amount uint256 NOT NULL
);
