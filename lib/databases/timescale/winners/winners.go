// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package winners

// winners is a winner tracked by an event on-chain.

import (
	"database/sql"
	"fmt"
	"time"

	solApps "github.com/fluidity-money/fluidity-app/common/solana/applications"
	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/timescale"
	ethApps "github.com/fluidity-money/fluidity-app/lib/types/applications"
	"github.com/fluidity-money/fluidity-app/lib/types/ethereum"
	"github.com/fluidity-money/fluidity-app/lib/types/misc"
	"github.com/fluidity-money/fluidity-app/lib/types/network"
	token_details "github.com/fluidity-money/fluidity-app/lib/types/token-details"
	"github.com/fluidity-money/fluidity-app/lib/types/winners"
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

type PendingRewardData struct {
	SendHash    ethereum.Hash
	RewardType  winners.RewardType
	Application ethApps.Application
}

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
				send_transaction_hash,
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
				send_transaction_hash,
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
			$10,
			$11
		);`

	_, err := timescaleClient.Exec(
		statementText,
		winner.Network,
		winner.TransactionHash,
		winner.SendTransactionHash,
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
// GetAndRemovePendingRewardData to fetch and remove the type (send or receive)
// of an unsent win as well as the application that was involved
// using the hash of the reward payout transaction
func GetAndRemovePendingRewardData(net network.BlockchainNetwork, token token_details.TokenDetails, firstBlock, lastBlock misc.BigInt, address ethereum.Address) []PendingRewardData {

	timescaleClient := timescale.Client()

	var (
		shortName = token.TokenShortName
		first = firstBlock.Int64()
		last = lastBlock.Int64()
	)

	statementText := fmt.Sprintf(
		`DELETE FROM %s
		WHERE
			network = $1
			AND token_short_name = $2
			AND block_number >= $3
			AND block_number <= $4
			AND winner_address = $5
		RETURNING
			is_sender,
			application,
			send_transaction_hash
		;`,

		TablePendingRewardType,
	)

	rows, err := timescaleClient.Query(
		statementText,
		net,
		shortName,
		first,
		last,
		address,
	)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Context = Context

			k.Format(
				"Failed to fetch pending reward type with address %s!",
				address.String(),
			)

			k.Payload = err
		})
	}

	defer rows.Close()


	var rewards []PendingRewardData

	for rows.Next() {
		var (
			isSender bool
			application_ string
			sendHash_ string
		)

		err := rows.Scan(
			&isSender,
			&application_,
			&sendHash_,
		)

		if err != nil {
			log.Fatal(func(k *log.Log) {
				k.Context = Context

				k.Format(
					"Failed to scan a row of pending reward data for address %s!",
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

		sendHash := ethereum.HashFromString(sendHash_)

		var rewardType winners.RewardType

		if isSender {
			rewardType = "send"
		} else {
			rewardType = "receive"
		}

		reward := PendingRewardData{
			SendHash:    sendHash,
			RewardType:  rewardType,
			Application: application,
		}

		rewards = append(rewards, reward)
	}

	return rewards
}

// Ethereum Specific
// InsertPendingRewardType to store the reward type and application of a pending win
func InsertPendingRewardType(net network.BlockchainNetwork, token token_details.TokenDetails, blockNumber uint64, sendTransactionHash ethereum.Hash, senderAddress ethereum.Address, receipientAddress ethereum.Address, application Application) {

	timescaleClient := timescale.Client()

	statementText := fmt.Sprintf(
		`INSERT INTO %s (
			network,
			token_short_name,
			send_transaction_hash,
			winner_address,
			is_sender,
			application,
			block_number
		)

		VALUES (
			$1,
			$2,
			$3,
			$4,
			$5,
			$6,
			$7
		);`,

		TablePendingRewardType,
	)

	// insert the sender's value
	_, err := timescaleClient.Exec(
		statementText,
		net,
		token.TokenShortName,
		sendTransactionHash,
		senderAddress,
		true,
		application.String(),
		blockNumber,
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
		net,
		token.TokenShortName,
		sendTransactionHash,
		receipientAddress,
		false,
		application.String(),
		blockNumber,
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

