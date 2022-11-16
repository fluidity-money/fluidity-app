// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package worker

import (
	"encoding/json"
	"time"

	"github.com/fluidity-money/fluidity-app/lib/types/misc"
	"github.com/fluidity-money/fluidity-app/lib/types/network"
	"github.com/fluidity-money/fluidity-app/lib/types/token-details"
)

type (
	// WorkerConfigEthereum to be used with any EVM chains to store config
	// that was previously hardcoded
	WorkerConfigEthereum struct {
		Network                       network.BlockchainNetwork `json:"network"`
		CompoundBlocksPerDay          int                       `json:"compound_blocks_per_day"`
		DefaultSecondsSinceLastBlock  uint64                    `json:"default_seconds_since_last_block"`
		CurrentAtxTransactionMargin   int64                     `json:"current_atx_transaction_margin"`
		DefaultTransfersInBlock       int                       `json:"default_transfers_in_block"`
		AtxBufferSize                 int                       `json:"atx_buffer_size"`
		SpoolerInstantRewardThreshold float64                   `json:"spooler_instant_reward_threshold"`
		SpoolerBatchedRewardThreshold float64                   `json:"spooler_batched_reward_threshold"`
	}

	// WorkerConfigSolana that was previously hardcoded for Solana only
	WorkerConfigSolana struct {
		SolanaBlockTime uint64 `json:"solana_block_time"`
		TransferCompute int    `json:"transfer_compute"`
		AtxBufferSize   int    `json:"atx_buffer_size"`
	}

	// Emission contains information on the modelling information that led
	// up to the rewarding of the user
	Emission struct {
		LastUpdated time.Time `json:"last_updated"`

		Network          string                     `json:"network"`
		TokenDetails     token_details.TokenDetails `json:"token_details"`
		TransactionHash  string                     `json:"transaction_hash"`
		RecipientAddress string                     `json:"recipient_address"`
		SenderAddress    string                     `json:"sender_address"`

		EthereumBlockNumber misc.BigInt `json:"ethereum_block_number"`
		SolanaSlotNumber    misc.BigInt `json:"solana_slot_number"`

		AverageTransfersInBlock float64 `json:"average_transfers_in_block"`

		AtxBufferSize    int    `json:"atx_buffer_size"`
		TransfersInBlock int    `json:"transfers_in_block"`
		TransfersPast    string `json:"transfers_past"`

		SecondsSinceLastBlock uint64 `json:"seconds_since_last_block"`

		GasLimit  uint64      `json:"gas_limit"`
		GasTipCap misc.BigInt `json:"gas_tip_cap"`

		GasLimitNormal  float64 `json:"gas_limit_normal"`
		GasTipCapNormal float64 `json:"gas_tip_cap_normal"`

		GasUsed       uint64  `json:"gas_used"`
		GasUsedNormal float64 `json:"gas_used_normal"`

		TransferFeeNormal float64 `json:"transfer_fee_normal"`

		BlockBaseFee       misc.BigInt `json:"block_base_fee"`
		BlockBaseFeeNormal float64     `json:"block_base_fee_normal"`

		MaxPriorityFeePerGas       misc.BigInt `json:"max_priority_fee_per_gas"`
		MaxPriorityFeePerGasNormal float64     `json:"max_priority_fee_per_gas_normal"`

		MaxFeePerGas misc.BigInt `json:"max_fee_per_gas"`
		MaxFeePerGasNormal float64 `json:"max_fee_per_gas_normal"`

		EffectiveGasPriceNormal float64 `json:"effective_gas_price_normal"`

		Payout struct {
			Winnings        float64 `json:"winnings"` // Winnings
			P               float64 `json:"p"`        // Probability
			A               float64 `json:"a"`
			M               int64   `json:"m"` // Winning classes / divisions
			G               float64 `json:"g"` // Gas fee
			B               int64   `json:"b"` // Balls in a single ticket
			Delta           float64 `json:"delta"`
			ApyPlusDelta    float64 `json:"apy+delta"`
			Atx             float64 `json:"atx"`                // Annual number fluid transactions
			Apy             float64 `json:"apy"`                // Annual percentage yield
			BpyForStakedUsd float64 `json:"bpy_for_staked_usd"` // Yield for USD
			BlockTime       uint64  `json:"block_time"`         // Block time
			RewardPool      float64 `json:"reward_pool"`
		} `json:"payout"`

		// app fees for solana transactions
		SolanaAppFees SolanaAppFees `json:"solana_fees"`

		// app fees for eth transactions
		EthereumAppFees EthereumAppFees `json:"ethereum_fees"`

		// calculate n function
		CalculateN struct {
			ProbabilityM float64 `json:"probability_m"`
			Factorial    float64 `json:"factorial"`
			Atx          float64 `json:"atx"`
			N            int64   `json:"n"`
		} `json:"calculate_n"`

		// WinningChances not included

		NaiveIsWinning struct {
			TestingBalls []uint32 `json:"testing_balls"`
			IsWinning    bool     `json:"is_winning"`
			MatchedBalls int      `json:"matched_balls"`
		} `json:"naive_is_winning"`

		CalculateBpy struct {
			BlockTimeInSeconds                          uint64  `json:"block_time_in_seconds"`
			CompSupplyApy                               float64 `json:"comp_supply_apy"`
			BlockTimeInSecondsMultipliedByCompSupplyApy float64 `json:"block_time_in_seconds_multiplied_by_comp_supply_apy"`
		} `json:"calculate_bpy"`

		AaveGetTokenApy struct {
			DepositApr       float64 `json:"deposit_apr"`
			APRPerDay        float64 `json:"apr_per_day"`
			OnePlusAprPerDay float64 `json:"one_plus_apr_per_day"`
			CompoundedApr    float64 `json:"compounded_apr"`
			DepositApy       float64 `json:"deposit_apy"`
		} `json:"aave_get_token_apy"`

		CompoundGetTokenApy struct {
			BlocksPerDay                      uint64  `json:"blocks_per_day"`
			SupplyRatePerBlockDivEthMantissa  float64 `json:"supply_rate_per_block_div_eth_mantissa"`
			SupplyRatePerBlockMulBlocksPerDay float64 `json:"supply_rate_per_block_mul_blocks_per_day"`
			PowLeftSide                       float64 `json:"pow_left_side"`
			PowLeftSideDaysPerYear            float64 `json:"pow_left_side_days_per_year"`
			SupplyApy                         float64 `json:"supply_apy"`
		} `json:"compound_get_token_apy"`

		WinningChances struct {
			AtxAtEnd float64 `json:"atx_at_end"`

			Payout1 float64 `json:"payout_1"`
			Payout2 float64 `json:"payout_2"`
			Payout3 float64 `json:"payout_3"`
			Payout4 float64 `json:"payout_4"`
			Payout5 float64 `json:"payout_5"`

			Probability1 float64 `json:"probability_1"`
			Probability2 float64 `json:"probability_2"`
			Probability3 float64 `json:"probability_3"`
			Probability4 float64 `json:"probability_4"`
			Probability5 float64 `json:"probability_5"`
		} `json:"winning_chances"`
	}

	// app fees for solana transactions
	SolanaAppFees struct {
		Saber    float64 `json:"saber"`
		Orca     float64 `json:"orca"`
		Raydium  float64 `json:"raydium"`
		AldrinV1 float64 `json:"aldrin_v1"`
		AldrinV2 float64 `json:"aldrin_v2"`
		Lifinity float64 `json:"lifinity"`
	}

	// app fees for ethereum transactions
	EthereumAppFees struct {
		UniswapV2        float64 `json:"uniswap_v2"`
		BalancerV2       float64 `json:"balancer_v2"`
		OneInchV2        float64 `json:"oneinch_v2"`
		OneInchV1        float64 `json:"oneinch_v1"`
		Mooniswap        float64 `json:"mooniswap"`
		OneInchFixedRate float64 `json:"oneinch_fixedrate"`
		DodoV2           float64 `json:"dodo_v2"`
		Curve            float64 `json:"curve"`
		Multichain       float64 `json:"multichain"`
		XyFinance        float64 `json:"xyfinance"`
	}
)

// Update LastUpdated using the current time
func (emission *Emission) Update() {
	emission.LastUpdated = time.Now()
}

// String the emission to make it suitable for printing
func (emission Emission) String() string {
	bytes, _ := json.Marshal(emission)
	return string(bytes)
}
