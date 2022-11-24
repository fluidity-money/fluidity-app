// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package winners

// winners is a winner tracked by an event on-chain.

import (
	"database/sql"
	"fmt"
	"time"

	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/timescale"
	ethApps "github.com/fluidity-money/fluidity-app/lib/types/applications"
	solApps "github.com/fluidity-money/fluidity-app/common/solana/applications"
	"github.com/fluidity-money/fluidity-app/lib/types/ethereum"
	"github.com/fluidity-money/fluidity-app/lib/types/misc"
	"github.com/fluidity-money/fluidity-app/lib/types/network"
	"github.com/fluidity-money/fluidity-app/lib/types/winners"
	"github.com/fluidity-money/fluidity-app/lib/util"
)

const (
	// Context to use for logging
	Context = `TIMESCALE/WINNERS`

	// TableWinners to use to record winners based on the contract calls
	TableWinners = `winners`

	// TablePendingRewardType to store whether a winner is a sender or receiver
	TablePendingRewardType = "ethereum_pending_reward_type"
)

type (
	Winner		= winners.Winner
	Application = winners.Application
)

func InsertWinner(winner Winner) {
	timescaleClient := timescale.Client()

	var (
		tokenShortName    = winner.TokenDetails.TokenShortName
		tokenDecimals     = winner.TokenDetails.TokenDecimals
		applicationString = winner.Application

		statementText string
	)

	switch winner.Network {
	case network.NetworkEthereum:
		statementText = fmt.Sprintf(
			`INSERT INTO %s (
				network,
				transaction_hash,
				winning_address,
				solana_winning_owner_address,
				winning_amount,
				awarded_time,
				token_short_name,
				token_decimals,
				reward_type,
				ethereum_application
			)`,
			TableWinners,
		)

	case network.NetworkSolana:
		statementText = fmt.Sprintf(
			`INSERT INTO %s (
				network,
				transaction_hash,
				winning_address,
				solana_winning_owner_address,
				winning_amount,
				awarded_time,
				token_short_name,
				token_decimals,
				reward_type,
				solana_application
			)`,
			TableWinners,
		)
	}

	statementText +=
		`VALUES (
			$1,
			$2,
			$3,
			$4,
			$5,
			$6,
			$7,
			$8,
			$9,
			$10
		);`

	_, err := timescaleClient.Exec(
		statementText,
		winner.Network,
		winner.TransactionHash,
		winner.WinnerAddress,
		winner.SolanaWinnerOwnerAddress,
		winner.WinningAmount,
		winner.AwardedTime,
		tokenShortName,
		tokenDecimals,
		winner.RewardType,
		applicationString,
	)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Context = Context
			k.Message = "Failed to insert a winner!"
			k.Payload = err
		})
	}
}

// GetWinners in the past, limited by a number
func GetLatestWinners(blockchainNetwork network.BlockchainNetwork, limit int) []Winner {
	timescaleClient := timescale.Client()

	statementText := fmt.Sprintf(
		`SELECT
			network,
			transaction_hash,
			winning_address,
			winning_amount,
			awarded_time,
			token_short_name,
			token_decimals,
			solana_winning_owner_address,
			reward_type,
			ethereum_application,
			solana_application

		FROM %v
		WHERE network = $1
		ORDER BY awarded_time DESC
		LIMIT $2`,

		TableWinners,
	)

	rows, err := timescaleClient.Query(
		statementText,
		blockchainNetwork,
		limit,
	)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Context = Context

			k.Format(
				"Failed to get the latest winners with a count of %v!",
				limit,
			)

			k.Payload = err
		})
	}

	defer rows.Close()

	winners := make([]Winner, 0)

	for rows.Next() {
		var (
			winner                   Winner
			solanaWinnerOwnerAddress sql.NullString
			applicationSolana        string
			applicationEthereum      string
		)

		err := rows.Scan(
			&winner.Network,
			&winner.TransactionHash,
			&winner.WinnerAddress,
			&winner.WinningAmount,
			&winner.AwardedTime,
			&winner.TokenDetails.TokenShortName,
			&winner.TokenDetails.TokenDecimals,
			&solanaWinnerOwnerAddress,
			&winner.RewardType,
			&applicationSolana,
			&applicationEthereum,
		)

		if err != nil {
			log.Fatal(func(k *log.Log) {
				k.Context = Context
				k.Message = "Failed to scan a row of the latest winners!"
				k.Payload = err
			})
		}

		winner.SolanaWinnerOwnerAddress = solanaWinnerOwnerAddress.String

		var application Application

		switch winner.Network {
		case network.NetworkEthereum:
			application, err = ethApps.ParseApplicationName(applicationEthereum)

			if err != nil {
				log.Fatal(func(k *log.Log) {
					k.Context = Context
					k.Message = "Failed to convert application name into application!"
					k.Payload = err
				})
			}

		case network.NetworkSolana:
			application, err = solApps.ParseApplicationName(applicationSolana)

			if err != nil {
				log.Fatal(func(k *log.Log) {
					k.Context = Context
					k.Message = "Failed to convert application name into application!"
					k.Payload = err
				})
			}

		}

		winner.Application = application.String()

		winners = append(winners, winner)
	}

	return winners
}

// Ethereum Specific
// GetAndRemovePendingRewardType to fetch and remove the type (send or receive)
// of an unsent win as well as the application that was involved
// using the hash of the reward payout transaction
func GetAndRemovePendingRewardType(rewardTransactionHash ethereum.Hash, address ethereum.Address) (winners.RewardType, ethApps.Application) {

	timescaleClient := timescale.Client()

	statementText := fmt.Sprintf(
		`DELETE FROM %s
		WHERE
			reward_transaction_hash = $1
			AND winner_address = $2
		RETURNING
			is_sender,
			application
		;`,

		TablePendingRewardType,
	)

	row := timescaleClient.QueryRow(
		statementText,
		rewardTransactionHash,
		address,
	)

	var (
		isSender bool
		application_ string
	)

	err := row.Scan(
		&isSender,
		&application_,
	)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Context = Context

			k.Format(
				"Failed to fetch pending reward type with hash %v and address %s!",
				rewardTransactionHash,
				address.String(),
			)

			k.Payload = err
		})
	}

	application, err := ethApps.ParseApplicationName(application_)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Context = Context

			k.Format(
				"Fetched invalid application name %v!",
				application_,
			)

			k.Payload = err
		})
	}

	if isSender {
		return "send", application
	} else {
		return "receive", application
	}
}

// Ethereum Specific
// InsertPendingRewardType to store the reward type and application of a pending win
func InsertPendingRewardType(sendTransactionHash ethereum.Hash, senderAddress ethereum.Address, receipientAddress ethereum.Address, application Application) {

	timescaleClient := timescale.Client()

	statementText := fmt.Sprintf(
		`INSERT INTO %s (
			send_transaction_hash,
			winner_address,
			is_sender,
			application

		)

		VALUES (
			$1,
			$2,
			$3,
			$4
		);`,

		TablePendingRewardType,
	)

	// insert the sender's value
	_, err := timescaleClient.Exec(
		statementText,
		sendTransactionHash,
		senderAddress,
		true,
		application.String(),
	)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Context = Context

			k.Format(
				"Failed to insert pending reward type with hash %v!",
				sendTransactionHash,
			)

			k.Payload = err
		})
	}

	// insert the recipient's value
	_, err = timescaleClient.Exec(
		statementText,
		sendTransactionHash,
		receipientAddress,
		false,
		application.String(),
	)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Context = Context

			k.Format(
				"Failed to insert pending reward type with hash %v!",
				sendTransactionHash,
			)

			k.Payload = err
		})
	}
}

// AddRewardHashToPendingRewardType to insert the hash of the reward transaction for a pending reward type entry
func AddRewardHashToPendingRewardType(rewardTransactionHash ethereum.Hash, sendTransactionHash ethereum.Hash, winnerAddress ethereum.Address) {
	timescaleClient := timescale.Client()

	statementText := fmt.Sprintf(
		`UPDATE %s
			SET reward_transaction_hash = $1
			WHERE
				send_transaction_hash = $2
				AND winner_address = $3
		;`,

		TablePendingRewardType,
	)

	_, err := timescaleClient.Exec(
		statementText,
		rewardTransactionHash,
		sendTransactionHash,
		winnerAddress,
	)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Context = Context

			k.Format(
				"Failed to update pending reward type with reward hash %v!",
				rewardTransactionHash,
			)

			k.Payload = err
		})
	}
}

// CountWinnersForDateAndWinningAmount given, just the date given (any wins
// inside that day)
func CountWinnersForDateAndWinningAmount(network network.BlockchainNetwork, tokenName string, date time.Time) (uint64, misc.BigInt) {

	timescaleClient := timescale.Client()

	statementText := fmt.Sprintf(
		`SELECT
			count(1),
			SUM(winning_amount)

		FROM %s
		WHERE
			network = $1
			AND token_short_name = $2
			AND awarded_time
				BETWEEN $3
				AND $3 + INTERVAL '24 HOURS'
		`,

		TableWinners,
	)

	row := timescaleClient.QueryRow(
		statementText,
		network,
		tokenName,
		date,
	)

	var (
		winnersCount  uint64
		awardedAmount misc.BigInt
	)

	err := row.Scan(&winnersCount, &awardedAmount)

	if err == sql.ErrNoRows {

		// awardedAmount is set to the zero amount!

		return 0, awardedAmount
	}

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Context = Context

			k.Format(
				"Failed to count and sum the wins for the date %#v, network %#v!",
				date,
				network,
			)

			k.Payload = err
		})
	}

	return winnersCount, awardedAmount
}

// GetUniqueTokens gets TokenDetails for each unique tokens in the winners
func GetUniqueTokens(network network.BlockchainNetwork) []util.TokenDetailsBase {

	timescaleClient := timescale.Client()

	statementText := fmt.Sprintf(
		`SELECT DISTINCT token_short_name, token_decimals
		FROM %s
		WHERE network = $1
		`,

		TableWinners,
	)

	rows, err := timescaleClient.Query(
		statementText,
		network,
	)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Context = Context

			k.Format(
				"Failed to query all unique winners for network %#v!",
				network,
			)

			k.Payload = err
		})
	}

	defer rows.Close()

	tokenDetailsCollected := make([]util.TokenDetailsBase, 0)

	for rows.Next() {
		var (
			tokenName     string
			tokenDecimals int
		)

		err := rows.Scan(&tokenName, &tokenDecimals)

		if err != nil {
			log.Fatal(func(k *log.Log) {
				k.Context = Context

				k.Format(
					"Failed to scan the token name and decimals for network %#v!",
					network,
				)

				k.Payload = err
			})
		}

		tokenDetails := util.NewTokenDetailsBase(tokenName, tokenDecimals)

		tokenDetailsCollected = append(tokenDetailsCollected, tokenDetails)
	}

	return tokenDetailsCollected
}
