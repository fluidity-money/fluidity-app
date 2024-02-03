// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package worker

import (
	"encoding/json"
	"fmt"
	"math/big"
	"time"

	"github.com/fluidity-money/fluidity-app/lib/types/applications"
	"github.com/fluidity-money/fluidity-app/lib/types/ethereum"
	"github.com/fluidity-money/fluidity-app/lib/types/misc"
	"github.com/fluidity-money/fluidity-app/lib/types/network"
)

type (
	// UtilityVars to store the amount of token and its distribution rate, for payout calculations
	UtilityVars struct {
		// Name is the unique onchain id for this utility
		Name applications.UtilityName `json:"utility_name"`

		// PoolSizeNative is the amount of token to distribute in native tokens
		PoolSizeNative *big.Rat `json:"pool_size"`

		// TokenDecimalsScale is 1e(decimals)
		TokenDecimalsScale *big.Rat `json:"token_decimals"`

		// ExchangeRate is the number for which (usd value)/(exchange rate)*(decimal scale) = (native amount)
		ExchangeRate *big.Rat `json:"exchange_rate"`

		// DeltaWeight is the frequency with which to distribute tokens
		// For normal tokens, this is the number of seconds in a year (31536000)
		DeltaWeight *big.Rat `json:"delta_weight"`

		CalculationType CalculationType `json:"calculation_method"`
	}

	// Payout to store details on payouts in different token units
	Payout struct {
		// amount in native tokens, can be passed to chain
		Native misc.BigInt

		// amount normalised to usd (native/1e(decimals)*exchangeRate) for the spooler
		// this is a float and might be imprecise!
		Usd float64
	}

	// WorkerConfigEthereum to be used with any EVM chains to store config
	// that was previously hardcoded
	WorkerConfigEthereum struct {
		Network                       network.BlockchainNetwork `json:"network"`
		CompoundBlocksPerDay          int                       `json:"compound_blocks_per_day"`
		DefaultSecondsSinceLastBlock  float64                   `json:"default_seconds_since_last_block"`
		CurrentAtxTransactionMargin   int64                     `json:"current_atx_transaction_margin"`
		DefaultTransfersInBlock       int                       `json:"default_transfers_in_block"`
		AtxBufferSize                 int                       `json:"atx_buffer_size"`
		EpochBlocks                   int                       `json:"epoch_blocks"`
		SpoolerInstantRewardThreshold float64                   `json:"spooler_instant_reward_threshold"`
		SpoolerBatchedRewardThreshold float64                   `json:"spooler_batched_reward_threshold"`
	}

	// WorkerConfigSolana that was previously hardcoded for Solana only
	WorkerConfigSolana struct {
		SolanaBlockTime uint64 `json:"solana_block_time"`
		TransferCompute int    `json:"transfer_compute"`
		AtxBufferSize   int    `json:"atx_buffer_size"`
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
		UniswapV3        float64 `json:"uniswap_v3"`
		UniswapV2        float64 `json:"uniswap_v2"`
		BalancerV2       float64 `json:"balancer_v2"`
		OneInchV2        float64 `json:"oneinch_v2"`
		OneInchV1        float64 `json:"oneinch_v1"`
		Mooniswap        float64 `json:"mooniswap"`
		OneInchFixedRate float64 `json:"oneinch_fixedrate"`
		DodoV2           float64 `json:"dodo_v2"`
		Curve            float64 `json:"curve"`

		// Multichain is no longer used, but is kept here to be consistent with the database.
		Multichain   float64 `json:"multichain"`
		XyFinance    float64 `json:"xyfinance"`
		Apeswap      float64 `json:"apeswap"`
		Saddle       float64 `json:"saddle"`
		GTradeV6_1   float64 `json:"gtrade_v6_1"`
		Meson        float64 `json:"meson"`
		Camelot      float64 `json:"camelot"`
		CamelotV3    float64 `json:"camelot_v3"`
		Chronos      float64 `json:"chronos"`
		Sushiswap    float64 `json:"sushiswap"`
		KyberClassic float64 `json:"kyber_classic"`
		Wombat       float64 `json:"wombat"`
		SeawaterAmm  float64 `json:"seawater_amm"`
		TraderJoe    float64 `json:"trader_joe"`
		Lifi         float64 `json:"lifi"`
		Odos         float64 `json:"odos"`
		BetSwirl     float64 `json:"betswirl"`
		Paraswap     float64 `json:"paraswap"`
	}

	FeeSwitch struct {
		OriginalAddress ethereum.Address          `json:"original_address"`
		NewAddress      ethereum.Address          `json:"new_address"`
		Network         network.BlockchainNetwork `json:"network"`
	}

	SpecialPoolOptions struct {
		PayoutFreqOverride     *big.Rat
		DeltaWeightOverride    *big.Rat
		WinningClassesOverride int
	}
)

// CalculationType to determine how payouts are calculated
type CalculationType string

const (
	// CalculationTypeNormal to indicate the calculation type that the
	// fluid token and tokens like it use (normal trf operation)
	CalculationTypeNormal CalculationType = ""

	// CalculationTypeWorkerOverrides to indicate the calculation type used for
	// tokens that don't use the optimistic solution and may have workerconfig overrides
	CalculationTypeWorkerOverrides CalculationType = "worker config overrides"
)

// TrfMode allows switching trf features
type TrfMode string

const (
	// TrfModeNormal to indicate normal trf operation
	TrfModeNormal TrfMode = "normal"

	// TrfModeNoOptimisticSolution to disable the optimistic solution
	TrfModeNoOptimisticSolution TrfMode = "no optimistic solution"
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

// DebugString the UtilityVars, returning "name:pool size:token decimals
// scale:exchange rate:delta weight" for logging purposes
func (v UtilityVars) DebugString() string {
	poolSizeNative, _ := v.PoolSizeNative.Float64()

	tokenDecimalsScale, _ := v.TokenDecimalsScale.Float64()

	exchangeRate, _ := v.ExchangeRate.Float64()

	deltaWeight, _ := v.DeltaWeight.Float64()

	return fmt.Sprintf(
		"%v:%v:%v:%v:%v",
		v.Name,
		poolSizeNative,
		tokenDecimalsScale,
		exchangeRate,
		deltaWeight,
	)
}
