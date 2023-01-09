// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package worker

import (
	"fmt"
	"strconv"
	"strings"

	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/timescale"
	"github.com/fluidity-money/fluidity-app/lib/types/network"
	"github.com/fluidity-money/fluidity-app/lib/types/worker"
)

const (
	// Context to use for logging
	Context = "TIMESCALE/WORKER"

	// TableAverageAtx to use to get the average ATX from
	TableAverageAtx = "worker_buffered_atx"

	// TableEmissions to record emissions from workers
	TableEmissions = "worker_emissions"
)

type Emission = worker.Emission

func InsertEmissions(emission Emission) {
	timescaleClient := timescale.Client()

	var (
		network                    = emission.Network
		tokenDetails               = emission.TokenDetails
		transactionHash            = emission.TransactionHash
		recipientAddress           = emission.RecipientAddress
		senderAddress              = emission.SenderAddress
		payout                     = emission.Payout
		calculateN                 = emission.CalculateN
		naiveIsWinning             = emission.NaiveIsWinning
		calculateBpy               = emission.CalculateBpy
		aaveGetTokenApy            = emission.AaveGetTokenApy
		compoundGetTokenApy        = emission.CompoundGetTokenApy
		winningChances             = emission.WinningChances
		lastUpdated                = emission.LastUpdated
		averageTransfersInBlock    = emission.AverageTransfersInBlock
		atxBufferSize              = emission.AtxBufferSize
		transfersInBlock           = emission.TransfersInBlock
		transfersPast              = emission.TransfersPast
		secondsSinceLastBlock      = emission.SecondsSinceLastBlock
		ethAppFees                 = emission.EthereumAppFees
		solAppFees                 = emission.SolanaAppFees
		gasLimit                   = emission.GasLimit
		gasTipCap                  = emission.GasTipCap
		gasTipCapNormal            = emission.GasTipCapNormal
		gasLimitNormal             = emission.GasLimitNormal
		transferFeeNormal          = emission.TransferFeeNormal
		gasUsed                    = emission.GasUsed
		gasUsedNormal              = emission.GasUsedNormal
		blockBaseFee               = emission.BlockBaseFee
		blockBaseFeeNormal         = emission.BlockBaseFeeNormal
		maxPriorityFeePerGas       = emission.MaxPriorityFeePerGas
		maxPriorityFeePerGasNormal = emission.MaxPriorityFeePerGasNormal
		maxFeePerGas               = emission.MaxFeePerGas
		maxFeePerGasNormal         = emission.MaxFeePerGasNormal
		effectiveGasPriceNormal    = emission.EffectiveGasPriceNormal
	)

	var testingBallsString strings.Builder

	for i, ball := range naiveIsWinning.TestingBalls {
		ballString := strconv.FormatUint(uint64(ball), 10)

		if i > 0 {
			_, _ = testingBallsString.WriteRune(',')
		}

		_, _ = testingBallsString.WriteString(ballString)
	}

	statementText := fmt.Sprintf(
		`INSERT INTO %s (
			transaction_hash,
			recipient_address,
			sender_address,
			network,
			token_short_name,
			token_decimals,

			payout_winnings,
			payout_p,
			payout_a,
			payout_m,
			payout_g,
			payout_b,
			payout_delta,
			payout_apy_plus_delta,
			payout_atx,
			payout_apy,
			payout_bpy_for_staked_usd,
			payout_block_time,
			payout_reward_pool,

			calculate_n_probability_m,
			calculate_n_factorial,
			calculate_n_atx,
			calculate_n_n,

			naive_is_winning_testing_balls,

			calculate_bpy_block_time_in_seconds,
			calculate_bpy_comp_supply_apy,
			calculate_bpy_block_time_in_seconds_multiplied_by_comp_supply_apy,

			aave_get_token_apy_deposit_apr,
			aave_get_token_apy_a_p_r_per_day,
			aave_get_token_apy_one_plus_apr_per_day,
			aave_get_token_apy_compounded_apr,
			aave_get_token_apy_deposit_apy,

			compound_get_token_apy_blocks_per_day,
			compound_get_token_apy_supply_rate_per_block_div_eth_mantissa,
			compound_get_token_apy_supply_rate_per_block_mul_blocks_per_day,
			compound_get_token_apy_pow_left_side,
			compound_get_token_apy_pow_left_side_days_per_year,
			compound_get_token_apy_supply_apy,

			winning_chances,

			last_updated,

			payout_1,
			payout_2,
			payout_3,
			payout_4,
			payout_5,

			probability_1,
			probability_2,
			probability_3,
			probability_4,
			probability_5,

			naive_is_winning_is_winning,

			average_transfers_in_block,

			matched_balls,

			atx_buffer_size,
			transfers_in_block,
			transfers_past,
			seconds_since_last_block,

			uniswap_v2_fee,
			balancer_v_fee,
			oneinch_v2_fee,
			oneinch_v1_fee,
			mooniswap_fee,
			oneinch_fixedrate_fee,
			dodo_v2_fee,
			curve_fee,
			multichain_fee,
			xyfinance_fee,
			apeswap_fee,

			saber_fee,
			orca_fee,
			raydium_fee,
			aldrin_v1_fee,
			aldrin_v2_fee,
			lifinity_fee,

			gas_limit,
			gas_tip_cap,
			gas_limit_normal,
			gas_tip_cap_normal,
			transfer_fee_normal,

			gas_used,
			gas_used_normal,
			block_base_fee,
			block_base_fee_normal,

			max_priority_fee_per_gas,
			max_priority_fee_per_gas_normal,
			max_fee_per_gas,
			max_fee_per_gas_normal,
			effective_gas_price_normal
		)

		VALUES (
			$1,
			$2,
			$3,
			$4,
			$5,
			$6,

			$7,
			$8,
			$9,
			$10,
			$11,
			$12,
			$13,
			$14,
			$15,
			$16,
			$17,
			$18,
			$19,

			$20,
			$21,
			$22,
			$23,

			$24,

			$25,
			$26,
			$27,

			$28,
			$29,
			$30,
			$31,
			$32,

			$33,
			$34,
			$35,
			$36,
			$37,
			$38,

			$39,

			$40,

			$41,
			$42,
			$43,
			$44,
			$45,

			$46,
			$47,
			$48,
			$49,
			$50,

			$51,

			$52,

			$53,

			$54,
			$55,
			$56,
			$57,

			$58,
			$59,
			$60,
			$61,
			$62,
			$63,
			$64,
			$65,
			$66,
			$67,
			$68,

			$69,
			$70,
			$71,
			$72,
			$73,
			$74,

			$75,
			$76,
			$77,
			$78,
			$79,

			$80,
			$81,
			$82,
			$83,

			$84,
			$85,
			$86,
			$87,
			$88
		);`,

		TableEmissions,
	)

	_, err := timescaleClient.Exec(
		statementText,

		transactionHash,
		recipientAddress,
		senderAddress,
		network,
		tokenDetails.TokenShortName,
		tokenDetails.TokenDecimals,

		payout.Winnings,
		payout.P,
		payout.A,
		payout.M,
		payout.G,
		payout.B,
		payout.Delta,
		payout.ApyPlusDelta,
		payout.Atx,
		payout.Apy,
		payout.BpyForStakedUsd,
		payout.BlockTime,
		payout.RewardPool,

		calculateN.ProbabilityM,
		calculateN.Factorial,
		calculateN.Atx,
		calculateN.N,

		testingBallsString.String(),

		calculateBpy.BlockTimeInSeconds,
		calculateBpy.CompSupplyApy,
		calculateBpy.BlockTimeInSecondsMultipliedByCompSupplyApy,

		aaveGetTokenApy.DepositApr,
		aaveGetTokenApy.APRPerDay,
		aaveGetTokenApy.OnePlusAprPerDay,
		aaveGetTokenApy.CompoundedApr,
		aaveGetTokenApy.DepositApy,

		compoundGetTokenApy.BlocksPerDay,
		compoundGetTokenApy.SupplyRatePerBlockDivEthMantissa,
		compoundGetTokenApy.SupplyRatePerBlockMulBlocksPerDay,
		compoundGetTokenApy.PowLeftSide,
		compoundGetTokenApy.PowLeftSideDaysPerYear,
		compoundGetTokenApy.SupplyApy,

		winningChances.AtxAtEnd,

		lastUpdated,

		winningChances.Payout1,
		winningChances.Payout2,
		winningChances.Payout3,
		winningChances.Payout4,
		winningChances.Payout5,

		winningChances.Probability1,
		winningChances.Probability2,
		winningChances.Probability3,
		winningChances.Probability4,
		winningChances.Probability5,

		naiveIsWinning.IsWinning,

		averageTransfersInBlock,

		naiveIsWinning.MatchedBalls,

		atxBufferSize,
		transfersInBlock,
		transfersPast,
		secondsSinceLastBlock,

		ethAppFees.UniswapV2,
		ethAppFees.BalancerV2,
		ethAppFees.OneInchV2,
		ethAppFees.OneInchV1,
		ethAppFees.Mooniswap,
		ethAppFees.OneInchFixedRate,
		ethAppFees.DodoV2,
		ethAppFees.Curve,
		ethAppFees.Multichain,
		ethAppFees.XyFinance,
		ethAppFees.Apeswap,

		solAppFees.Saber,
		solAppFees.Orca,
		solAppFees.Raydium,
		solAppFees.AldrinV1,
		solAppFees.AldrinV2,
		solAppFees.Lifinity,

		gasLimit,
		gasTipCap,
		gasLimitNormal,
		gasTipCapNormal,
		transferFeeNormal,

		gasUsed,
		gasUsedNormal,
		blockBaseFee,
		blockBaseFeeNormal,

		maxPriorityFeePerGas,
		maxPriorityFeePerGasNormal,
		maxFeePerGas,
		maxFeePerGasNormal,
		effectiveGasPriceNormal,
	)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Context = Context
			k.Message = "Failed to insert an emission!"
			k.Payload = err
		})
	}
}

// GetAverageAtx, rounding up the average, taking the returned float64 and
// casting it to an integer
func GetAverageAtx(tokenShortName string, network network.BlockchainNetwork, limit int) (average int, blocks []uint64, transactionCounts []int) {

	timescaleClient := timescale.Client()

	statementText := fmt.Sprintf(
		`SELECT block_number, transaction_count
		FROM %s
		WHERE token_short_name = $1
		AND network = $2
		ORDER BY block_number DESC
		LIMIT $3`,

		TableAverageAtx,
	)

	log.Debugf(
		"token short name: %#v, network: %#v, limit: %#v",
		tokenShortName,
		network,
		limit,
	)

	rows, err := timescaleClient.Query(
		statementText,
		tokenShortName,
		network,
		limit,
	)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Context = Context
			k.Message = "Failed to query the average atx field for calculation!"
			k.Payload = err
		})
	}

	defer rows.Close()

	sum := 0

	blocks = make([]uint64, 0)

	transactionCounts = make([]int, 0)

	for rows.Next() {
		var (
			blockNumber      uint64
			transactionCount int
		)

		err := rows.Scan(&blockNumber, &transactionCount)

		if err != nil {
			log.Fatal(func(k *log.Log) {
				k.Context = Context
				k.Message = "Failed to scan the transaction count to an int!"
				k.Payload = err
			})
		}

		blocks = append(blocks, blockNumber)

		transactionCounts = append(transactionCounts, transactionCount)

		sum += transactionCount
	}

	average = sum / len(transactionCounts)

	return average, blocks, transactionCounts
}

// InsertTransactionCount for a block number for the number of transactions
// in a block
func InsertTransactionCount(blockNumber uint64, tokenShortName string, transactionCount int, network network.BlockchainNetwork) {

	timescaleClient := timescale.Client()

	statementText := fmt.Sprintf(
		`INSERT INTO %s (
			block_number,
			token_short_name,
			transaction_count,
			network
		)

		VALUES (
			$1,
			$2,
			$3,
			$4
		);`,

		TableAverageAtx,
	)

	_, err := timescaleClient.Exec(
		statementText,
		blockNumber,
		tokenShortName,
		transactionCount,
		network,
	)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Context = Context

			k.Format(
				"Failed to insert transaction count %v for block number %v!",
				transactionCount,
				blockNumber,
			)

			k.Payload = err
		})
	}
}
