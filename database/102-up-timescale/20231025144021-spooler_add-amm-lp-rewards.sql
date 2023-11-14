-- migrate:up

CREATE TABLE amm_positions (
	tick_lower INT NOT NULL,
	tick_upper INT NOT NULL,
	position_id uint256 UNIQUE NOT NULL,

	pool_address VARCHAR NOT NULL,

	liquidity uint256 NOT NULL
);

-- LP rewards are spooled in this table
CREATE TABLE pending_lp_rewards (
	-- processing id - set to a random string if this record has not been fully processed
	processing_snowflake BYTEA NOT NULL,

	-- token id
	fluid_token_short_name VARCHAR NOT NULL,
	network VARCHAR NOT NULL,

	utility_name VARCHAR NOT NULL,
	position_id uint256 NOT NULL,
	amount uint256 NOT NULL,

	reward_sent boolean NOT NULL
);

-- migrate:down

DROP TABLE amm_positions;
DROP TABLE pending_lp_rewards;
