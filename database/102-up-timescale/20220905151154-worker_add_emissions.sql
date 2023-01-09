-- migrate:up

CREATE TABLE worker_emissions (
	-- transaction info
	transaction_hash VARCHAR NOT NULL,
	recipient_address VARCHAR NOT NULL,
	sender_address VARCHAR NOT NULL,
	network network_blockchain,
	token_short_name VARCHAR NOT NULL,
	token_decimals SMALLINT,

	-- payout
	payout_winnings DOUBLE PRECISION,
	payout_p DOUBLE PRECISION,
	payout_a DOUBLE PRECISION,
	payout_m BIGINT,
	payout_g DOUBLE PRECISION,
	payout_b BIGINT,
	payout_delta DOUBLE PRECISION,
	payout_apy_plus_delta DOUBLE PRECISION,
	payout_atx DOUBLE PRECISION,
	payout_apy DOUBLE PRECISION,
	payout_bpy_for_staked_usd DOUBLE PRECISION,
	payout_block_time BIGINT,
	payout_reward_pool DOUBLE PRECISION,

	-- probability CalculateN
	calculate_n_probability_m DOUBLE PRECISION,
	calculate_n_factorial DOUBLE PRECISION,
	calculate_n_atx DOUBLE PRECISION,
	calculate_n_n BIGINT,

	-- probability NaiveIsWinning
	naive_is_winning_testing_balls BIGINT[],

	-- probability CalculateBpy
	calculate_bpy_block_time_in_seconds BIGINT,
	calculate_bpy_comp_supply_apy DOUBLE PRECISION,
	calculate_bpy_block_time_in_seconds_multiplied_by_comp_supply_apy DOUBLE PRECISION,

	-- aave GetTokenApy
	aave_get_token_apy_deposit_apr DOUBLE PRECISION,
	aave_get_token_apy_a_p_r_per_day DOUBLE PRECISION,
	aave_get_token_apy_one_plus_apr_per_day DOUBLE PRECISION,
	aave_get_token_apy_compounded_apr DOUBLE PRECISION,
	aave_get_token_apy_deposit_apy DOUBLE PRECISION,

	-- compound GetTokenApy
	compound_get_token_apy_blocks_per_day BIGINT,
	compound_get_token_apy_supply_rate_per_block_div_eth_mantissa DOUBLE PRECISION,
	compound_get_token_apy_supply_rate_per_block_mul_blocks_per_day DOUBLE PRECISION,
	compound_get_token_apy_pow_left_side DOUBLE PRECISION,
	compound_get_token_apy_pow_left_side_days_per_year DOUBLE PRECISION,
	compound_get_token_apy_supply_apy DOUBLE PRECISION,

	-- WinningChances
	winning_chances DOUBLE PRECISION
);

-- migrate:down

DROP TABLE worker_emissions;
