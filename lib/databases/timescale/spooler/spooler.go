// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package spooler

import (
	"database/sql"
	"fmt"

	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/timescale"
	"github.com/fluidity-money/fluidity-app/lib/types/applications"
	"github.com/fluidity-money/fluidity-app/lib/types/network"
	token_details "github.com/fluidity-money/fluidity-app/lib/types/token-details"
	"github.com/fluidity-money/fluidity-app/lib/types/worker"
)

const (
	// Context to use for logging
	Context = "TIMESCALE/SPOOLER"

	// TablePendingWinners to write pending winners for the
	// ethereum spooler to use
	TablePendingWinners = "ethereum_pending_winners"
)

func InsertPendingWinners(winner worker.EthereumWinnerAnnouncement, tokenDetails map[applications.UtilityName]token_details.TokenDetails) {
	timescaleClient := timescale.Client()

	var (
		fluidTokenDetails = winner.TokenDetails

		fluidTokenShortName = fluidTokenDetails.TokenShortName
		network_            = winner.Network
		hash                = winner.TransactionHash
		blockNumber         = winner.BlockNumber
		senderAddress       = winner.FromAddress
		senderWinAmount     = winner.FromWinAmount
		recipientAddress    = winner.ToAddress
		recipientWinAmount  = winner.ToWinAmount
		logIndex            = winner.LogIndex
	)

	statementText := fmt.Sprintf(
		`INSERT INTO %s (
			category,
			token_short_name,
			token_decimals,
			transaction_hash,
			address,
			win_amount,
			usd_win_amount,
			utility_name,
			block_number,
			network,
			reward_type,
			log_index
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
			$12
		);`,

		TablePendingWinners,
	)

	for utility, payout := range senderWinAmount {
		var (
			nativeWinAmount = payout.Native
			usdWinAmount    = payout.Usd
		)

		details, exists := tokenDetails[utility]

		if !exists {
			if utility != applications.UtilityFluid {
				log.Debug(func(k *log.Log) {
					k.Format(
						"Couldn't find utility %s in token details list %#v! Defaulting to %+v",
						utility,
						tokenDetails,
						fluidTokenDetails,
					)
				})
			}

			details = fluidTokenDetails
		}

		// insert the sender's winnings
		_, err := timescaleClient.Exec(
			statementText,
			fluidTokenShortName,
			details.TokenShortName,
			details.TokenDecimals,
			hash,
			senderAddress,
			nativeWinAmount,
			usdWinAmount,
			utility,
			blockNumber,
			network_,
			"send",
			logIndex,
		)

		if err != nil {
			log.Fatal(func(k *log.Log) {
				k.Context = Context

				k.Format(
					"Failed to insert pending winner %+v!",
					winner,
				)

				k.Payload = err
			})
		}
	}

	for utility, payout := range recipientWinAmount {
		// insert the recipient's winnings
		var (
			nativeWinAmount = payout.Native
			usdWinAmount    = payout.Usd
		)

		details, exists := tokenDetails[utility]

		if !exists {
			if utility != applications.UtilityFluid {
				log.Debug(func(k *log.Log) {
					k.Format(
						"Couldn't find utility %s in token details list %#v! Defaulting to %+v",
						utility,
						tokenDetails,
						fluidTokenDetails,
					)
				})
			}

			details = fluidTokenDetails
		}

		_, err := timescaleClient.Exec(
			statementText,
			fluidTokenShortName,
			details.TokenShortName,
			details.TokenDecimals,
			hash,
			recipientAddress,
			nativeWinAmount,
			usdWinAmount,
			utility,
			blockNumber,
			network_,
			"receive",
			logIndex,
		)

		if err != nil {
			log.Fatal(func(k *log.Log) {
				k.Context = Context

				k.Format(
					"Failed to insert pending winner %+v!",
					winner,
				)

				k.Payload = err
			})
		}
	}
}

func UnpaidWinningsForCategory(network_ network.BlockchainNetwork, token token_details.TokenDetails) float64 {
	timescaleClient := timescale.Client()

	statementText := fmt.Sprintf(
		`SELECT
			SUM(usd_win_amount)

		FROM %s
		WHERE
			network = $1
			AND category = $2
			AND reward_sent = false
		`,

		TablePendingWinners,
	)

	row := timescaleClient.QueryRow(
		statementText,
		network_,
		token.TokenShortName,
	)

	var total float64

	err := row.Scan(&total)

	if err == sql.ErrNoRows {
		return 0
	}

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Context = Context

			k.Format(
				"Failed to get unpaid winnings for token %s!",
				token.TokenShortName,
			)

			k.Payload = err
		})
	}

	return total
}

func GetAndRemoveRewardsForCategory(network_ network.BlockchainNetwork, token token_details.TokenDetails) []worker.EthereumReward {
	timescaleClient := timescale.Client()

	shortName := token.TokenShortName

	statementText := fmt.Sprintf(
		`UPDATE %s
			SET reward_sent = true
		WHERE
			reward_sent = false
			AND network = $1
			AND category = $2
		RETURNING
			network,
			token_short_name,
			token_decimals,
			transaction_hash,
			address,
			win_amount,
			block_number,
			utility_name,
			category
		;`,

		TablePendingWinners,
	)

	rows, err := timescaleClient.Query(
		statementText,
		network_,
		shortName,
	)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Context = Context

			k.Format(
				"Failed to fetch and mark winners as sent for token %s!",
				shortName,
			)

			k.Payload = err
		})
	}

	defer rows.Close()

	winners := make([]worker.EthereumReward, 0)

	for rows.Next() {
		var (
			winner worker.EthereumReward
		)

		err := rows.Scan(
			&winner.Network,
			&winner.TokenDetails.TokenShortName,
			&winner.TokenDetails.TokenDecimals,
			&winner.TransactionHash,
			&winner.Winner,
			&winner.WinAmount,
			&winner.BlockNumber,
			&winner.Utilityname,
			&winner.Category,
		)

		if err != nil {
			log.Fatal(func(k *log.Log) {
				k.Context = Context
				k.Message = "Failed to scan a row of the pending winners!"
				k.Payload = err
			})
		}

		winners = append(winners, winner)
	}

	return winners
}
