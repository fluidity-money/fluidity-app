// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package worker

import (
	"regexp"
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
)

func TestUpdate(t *testing.T) {
	now := time.Now()
	emission := new(Emission)
	emission.Update()
	assert.WithinDuration(t, now, emission.LastUpdated, time.Second)
}

func TestString(t *testing.T) {
	emission := new(Emission)
	emissionString := emission.String()

	whitespaceRegex := regexp.MustCompile(`[\n\t ]`)
	expectedString_ := `
{
	"last_updated":"0001-01-01T00:00:00Z",
	"network":"",
	"token_details":{
		"token_short_name":"",
		"token_decimals":0
	},
	"transaction_hash":"",
	"recipient_address":"",
	"sender_address":"",
	"ethereum_block_number":"0",
	"solana_slot_number":"0",
	"sui_checkpoint_number":"0",
	"average_transfers_in_block":0,
	"atx_buffer_size":0,
	"transfers_in_block":0,
	"transfers_past":"",
	"seconds_since_last_block":0,
	"gas_limit":"0",
	"gas_price":"0",
	"gas_tip_cap":"0",
	"gas_limit_normal":0,
	"gas_tip_cap_normal":0,
	"gas_used":"0",
	"gas_used_normal":0,
	"transfer_fee_normal":0,
	"block_base_fee":"0",
	"block_base_fee_normal":0,
	"max_priority_fee_per_gas":"0",
	"max_priority_fee_per_gas_normal":0,
	"max_fee_per_gas":"0",
	"max_fee_per_gas_normal":0,
	"effective_gas_price_normal":0,
	"payout":{
	"winnings":0,
		"p":0,
		"a":0,
		"m":0,
		"g":0,
		"b":0,
		"delta":0,
		"apy+delta":0,
		"atx":0,
		"apy":0,
		"bpy_for_staked_usd":0,
		"block_time":0,
		"reward_pool":0
	},
	"solana_fees":{
		"saber":0,
		"orca":0,
		"raydium":0,
		"aldrin_v1":0,
		"aldrin_v2":0,
		"lifinity":0
	},
	"ethereum_fees":{
		"uniswap_v3":0,
		"uniswap_v2":0,
		"balancer_v2":0,
		"oneinch_v2":0,
		"oneinch_v1":0,
		"mooniswap":0,
		"oneinch_fixedrate":0,
		"dodo_v2":0,
		"curve":0,
		"multichain":0,
		"xyfinance":0,
		"apeswap":0,
		"saddle":0,
		"gtrade_v6_1":0,
		"meson":0,
		"camelot":0,
		"camelot_v3":0,
		"chronos":0,
		"sushiswap":0,
		"kyber_classic":0,
		"wombat":0,
		"seawater_amm":0,
		"trader_joe": 0,
		"lifi": 0,
		"odos": 0,
		"betswirl": 0,
		"paraswap": 0
	},
	"sui_fees":{},
	"calculate_n":{
		"probability_m":0,
		"factorial":0,
		"atx":0,
		"n":0
	},
	"naive_is_winning":{
		"testing_balls":null,
		"is_winning":false,
		"matched_balls":0
	},
	"calculate_bpy":{
		"block_time_in_seconds":0,
		"comp_supply_apy":0,
		"block_time_in_seconds_multiplied_by_comp_supply_apy":0
	},
	"aave_get_token_apy":{
		"deposit_apr":0,
		"apr_per_day":0,
		"one_plus_apr_per_day":0,
		"compounded_apr":0,
		"deposit_apy":0
	},
	"compound_get_token_apy":{
		"blocks_per_day":0,
		"supply_rate_per_block_div_eth_mantissa":0,
		"supply_rate_per_block_mul_blocks_per_day":0,
		"pow_left_side":0,
		"pow_left_side_days_per_year":0,
		"supply_apy":0
	},
	"winning_chances":{
		"atx_at_end":0,
		"payout_1":0,
		"payout_2":0,
		"payout_3":0,
		"payout_4":0,
		"payout_5":0,
		"probability_1":0,
		"probability_2":0,
		"probability_3":0,
		"probability_4":0,
		"probability_5":0,
		"total_bpy":0,
		"distribution_pools":""
	},
	"fee_switch_sender":{
		"original_address":"",
		"new_address":"",
		"fee_switch_reason":""
	},
	"fee_switch_recipient":{
		"original_address":"",
		"new_address":"",
		"fee_switch_reason":""
	},
	"special_pool_options":{
		"payout_freq_override":0,
		"delta_weight_override":0,
		"winning_classes_override":0
	}
}
`
	expectedString := whitespaceRegex.ReplaceAllString(expectedString_, "")

	assert.Equal(t, expectedString, emissionString)
}
