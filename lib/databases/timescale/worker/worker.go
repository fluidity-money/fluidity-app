// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package worker

import (
	"database/sql"
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
		network             = emission.Network
		tokenDetails        = emission.TokenDetails
		transactionHash     = emission.TransactionHash
		recipientAddress    = emission.RecipientAddress
		senderAddress       = emission.SenderAddress
		payout              = emission.Payout
		calculateN          = emission.CalculateN
		naiveIsWinning      = emission.NaiveIsWinning
		calculateBpy        = emission.CalculateBpy
		aaveGetTokenApy     = emission.AaveGetTokenApy
		compoundGetTokenApy = emission.CompoundGetTokenApy
		winningChances      = emission.WinningChances
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

			winning_chances
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

			$39
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
func GetAverageAtx(blockFrom uint64, tokenShortName string, network network.BlockchainNetwork) int {

	timescaleClient := timescale.Client()

	statementText := fmt.Sprintf(
		`SELECT AVG(transaction_count)
		FROM %s
		WHERE block_number >= $1
		AND token_short_name = $2
		AND network = $3`,

		TableAverageAtx,
	)

	row := timescaleClient.QueryRow(
		statementText,
		blockFrom,
		tokenShortName,
		network,
	)

	var average_ float64

	err := row.Scan(&average_)

	switch err {
	case nil:

	case sql.ErrNoRows:
		return 0

	default:
		log.Fatal(func(k *log.Log) {
			k.Context = Context
			k.Message = "Failed to query the row for averages"
			k.Payload = err
		})
	}

	// the number here discards the fraction!

	average := int(average_)

	return average
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
