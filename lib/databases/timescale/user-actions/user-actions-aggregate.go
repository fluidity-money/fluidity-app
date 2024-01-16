// Copyright 2023 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package user_actions

import (
	"database/sql"
	"fmt"

	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/timescale"
	"github.com/fluidity-money/fluidity-app/lib/types/network"
	user_actions "github.com/fluidity-money/fluidity-app/lib/types/user-actions"
)

const TableAggregatedUserTransactions = `aggregated_user_transactions`

func InsertAggregatedUserTransaction(userTransaction user_actions.AggregatedUserTransaction) {
	timescaleClient := timescale.Client()

	statementText := fmt.Sprintf(
		`INSERT INTO %s (
			token_short_name,
			network,
			time,
			transaction_hash,
			sender_address,
			recipient_address,
			amount,
			application,
			winning_address,
			winning_amount,
			reward_hash,
			type,
			swap_in,
			utility_amount,
			utility_name
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
			$15
		)`,

		TableAggregatedUserTransactions,
	)

	_, err := timescaleClient.Exec(
		statementText,
		userTransaction.TokenShortName,
		userTransaction.Network,
		userTransaction.Time,
		userTransaction.TransactionHash,
		userTransaction.SenderAddress,
		userTransaction.RecipientAddress,
		userTransaction.Amount,
		userTransaction.Application,
		userTransaction.WinningAddress,
		userTransaction.WinningAmount,
		userTransaction.RewardHash,
		userTransaction.Type,
		userTransaction.SwapIn,
		userTransaction.UtilityAmount,
		userTransaction.UtilityName,
	)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Context = Context
			k.Message = "Failed to insert aggregated user transaction!"
			k.Payload = err
		})
	}
}

func GetAggregatedUserTransactionByHash(network network.BlockchainNetwork, transactionHash string) *user_actions.AggregatedUserTransaction {
	timescaleClient := timescale.Client()

	statementText := fmt.Sprintf(
		`SELECT
			token_short_name,
			time,
			transaction_hash,
			sender_address,
			recipient_address,
			amount,
			application,
			winning_address,
			winning_amount,
			reward_hash,
			type,
			swap_in,
			utility_amount,
			utility_name

		FROM %v
		WHERE network = $1
		AND transaction_hash = $2`,

		TableAggregatedUserTransactions,
	)

	row := timescaleClient.QueryRow(
		statementText,
		network,
		transactionHash,
	)

	userTransaction := user_actions.AggregatedUserTransaction{
		Network: network,
	}

	err := row.Scan(
		&userTransaction.TokenShortName,
		&userTransaction.Time,
		&userTransaction.TransactionHash,
		&userTransaction.SenderAddress,
		&userTransaction.RecipientAddress,
		&userTransaction.Amount,
		&userTransaction.Application,
		&userTransaction.WinningAddress,
		&userTransaction.WinningAmount,
		&userTransaction.RewardHash,
		&userTransaction.Type,
		&userTransaction.SwapIn,
		&userTransaction.UtilityAmount,
		&userTransaction.UtilityName,
	)

	if err != nil {
		if err == sql.ErrNoRows {
			return nil
		}

		log.Fatal(func(k *log.Log) {
			k.Context = Context
			k.Format(
				"Failed to scan an aggregated user transaction row filtered by network %v and transaction hash %v!",
				network,
				transactionHash,
			)
			k.Payload = err
		})
	}

	return &userTransaction
}

// update an aggregated user transaction with the given hash and network
func UpdateAggregatedUserTransactionByHash(userTransaction user_actions.AggregatedUserTransaction, transactionHash string) {
	timescaleClient := timescale.Client()

	statementText := fmt.Sprintf(
		`UPDATE %s SET
			token_short_name = $1,
			network = $2,
			time = $3,
			transaction_hash = $4,
			sender_address = $5,
			recipient_address = $6,
			amount = $7,
			application = $8,
			winning_address = $9,
			winning_amount = $10,
			reward_hash = $11,
			type = $12,
			swap_in = $13,
			utility_amount = $14,
			utility_name = $15
		WHERE transaction_hash = $16
			AND network = $2
		`,

		TableAggregatedUserTransactions,
	)

	_, err := timescaleClient.Exec(
		statementText,
		userTransaction.TokenShortName,
		userTransaction.Network,
		userTransaction.Time,
		userTransaction.TransactionHash,
		userTransaction.SenderAddress,
		userTransaction.RecipientAddress,
		userTransaction.Amount,
		userTransaction.Application,
		userTransaction.WinningAddress,
		userTransaction.WinningAmount,
		userTransaction.RewardHash,
		userTransaction.Type,
		userTransaction.SwapIn,
		userTransaction.UtilityAmount,
		userTransaction.UtilityName,
		userTransaction.TransactionHash,
	)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Context = Context
			k.Message = "Failed to update aggregated user transaction!"
			k.Payload = err
		})
	}
}

// UpdateAggregatedUserTransactionByHashWithLootbottles after finding it first
func UpdateAggregatedUserTransactionByHashWithLootbottles(lootbottlesCount float64, rewardTier int, transactionHash string) {
	timescaleClient := timescale.Client()

	statementText := fmt.Sprintf(
		`UPDATE %s
			SET lootbox_count = $1 + %s.lootbox_count, reward_tier = GREATEST($2, %s.reward_tier)
			WHERE transaction_hash = $3`,

		TableAggregatedUserTransactions,
		TableAggregatedUserTransactions,
		TableAggregatedUserTransactions,
	)

	r, err := timescaleClient.Exec(
		statementText,
		lootbottlesCount,
		rewardTier,
		transactionHash,
	)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Context = Context

			k.Format(
				"Failed to update an aggregated user transaction with a lootbottle, transaction hash %v, reward tier %v, lootbottles count %v",
				transactionHash,
				rewardTier,
				lootbottlesCount,
			)

			k.Payload = err
		})
	}

	rows, _ := r.RowsAffected()

	if rows != 1 {
		log.Fatal(func(k *log.Log) {
			k.Context = Context

			k.Format(
				"%d rows affected by an aggregate user transaction with lootbottle update, expected 1!, transaction hash %v, reward tier %v, lootbottles count %v",
				rows,
				transactionHash,
				rewardTier,
				lootbottlesCount,
			)

			k.Payload = err
		})
	}
}
