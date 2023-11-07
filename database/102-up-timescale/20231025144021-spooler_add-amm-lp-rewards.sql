-- migrate:up

CREATE TABLE amm_positions (
	tick_lower INT NOT NULL,
	tick_upper INT NOT NULL,
	position_id uint256 UNIQUE NOT NULL,

	-- token id
	pool VARCHAR NOT NULL,

	liquidity uint256 NOT NULL
);

CREATE TABLE pending_lp_rewards (
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
