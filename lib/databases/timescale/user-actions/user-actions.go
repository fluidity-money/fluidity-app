// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package user_actions

import (
	"database/sql"
	"fmt"

	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/timescale"
	"github.com/fluidity-money/fluidity-app/lib/types/misc"
	"github.com/fluidity-money/fluidity-app/lib/types/network"
	"github.com/fluidity-money/fluidity-app/lib/types/user-actions"
)

const (
	// Context to use when logging
	Context = `TIMESCALE/USER_ACTION`

	// TableUserActions to use when recording user actions to the timescale
	TableUserActions = `user_actions`
)

type UserAction = user_actions.UserAction

// UserActionDb is used to temporarily store and cast amount into BigInt
// Necessary because database cannot accurately store 1e21+ as Numeric
type UserActionDb struct {
	userAction   UserAction
	amountString string
}

// InsertUserAction to the database, setting time to the current timestamp
func InsertUserAction(userAction UserAction) {
	timescaleClient := timescale.Client()

	var (
		tokenShortName = userAction.TokenDetails.TokenShortName
		tokenDecimals  = userAction.TokenDetails.TokenDecimals
	)

	statementText := fmt.Sprintf(
		`INSERT INTO %s (
			event_number,
			network,
			type,
			transaction_hash,
			log_index,
			swap_in,
			sender_address,
			recipient_address,
			amount,
			token_short_name,
			token_decimals,
			solana_sender_owner_address,
			solana_recipient_owner_address
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
			$13
		)`,

		TableUserActions,
	)

	_, err := timescaleClient.Exec(
		statementText,
		userAction.EventNumber,
		userAction.Network,
		userAction.Type,
		userAction.TransactionHash,
		userAction.LogIndex,
		userAction.SwapIn,
		userAction.SenderAddress,
		userAction.RecipientAddress,
		userAction.Amount.String(), // Store Amount as string in database
		tokenShortName,
		tokenDecimals,
		userAction.SolanaSenderOwnerAddress,
		userAction.SolanaRecipientOwnerAddress,
	)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Context = Context
			k.Message = "Failed to insert user action!"
			k.Payload = err
		})
	}
}

// GetUserActionsWithSenderAddressOrRecipientAddress, returning results
// that either contain the address specified as the recipient or the sender
func GetUserActionsWithSenderAddressOrRecipientAddress(network network.BlockchainNetwork, address string, limit int) []UserAction {
	timescaleClient := timescale.Client()

	statementText := fmt.Sprintf(
		`SELECT
			event_number,
			type,
			transaction_hash,
			log_index,
			swap_in,
			sender_address,
			recipient_address,
			amount,
			time,
			token_short_name,
			token_decimals,
			solana_sender_owner_address,
			solana_recipient_owner_address

		FROM %v
		WHERE network = $1
		AND (sender_address = $2
			OR recipient_address = $2)
		ORDER BY time DESC
		LIMIT $3`,

		TableUserActions,
	)

	rows, err := timescaleClient.Query(
		statementText,
		network,
		address,
		limit,
	)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Context = Context
			k.Message = "Failed to get user actions with a spender address!"
			k.Payload = err
		})
	}

	defer rows.Close()

	userActions := make([]UserAction, 0)

	for rows.Next() {
		preCastUserAction := UserActionDb{
			userAction: UserAction{
				Network: network,
			},
		}

		userAction := preCastUserAction.userAction

		var solanaSenderOwnerAddress, solanaRecipientOwnerAddress sql.NullString

		err := rows.Scan(
			&userAction.EventNumber,
			&userAction.Type,
			&userAction.TransactionHash,
			&userAction.LogIndex,
			&userAction.SwapIn,
			&userAction.SenderAddress,
			&userAction.RecipientAddress,
			&preCastUserAction.amountString,
			&userAction.Time,
			&userAction.TokenDetails.TokenShortName,
			&userAction.TokenDetails.TokenDecimals,
			&solanaSenderOwnerAddress,
			&solanaRecipientOwnerAddress,
		)

		if err != nil {
			log.Fatal(func(k *log.Log) {
				k.Context = Context
				k.Message = "Failed to scan a user action row filtered by spender address!"
				k.Payload = err
			})
		}

		userAction.SolanaSenderOwnerAddress = solanaSenderOwnerAddress.String
		userAction.SolanaRecipientOwnerAddress = solanaRecipientOwnerAddress.String

		// Cast string amount from database to BigInt
		amount, err := misc.BigIntFromString(preCastUserAction.amountString)
		if err != nil {
			log.Fatal(func(k *log.Log) {
				k.Context = Context
				k.Message = "Failed to cast user action amount from db!"
				k.Payload = err
			})
		}

		userAction.Amount = *amount

		userActions = append(userActions, userAction)
	}

	return userActions
}

// GetUserActionsWithSenderAddressOrRecipientOwnerAddress, returning results
// that either contain the solana base account address specified as the
// recipient or the sender
func GetUserActionsWithSenderAddressOrRecipientOwnerAddress(network network.BlockchainNetwork, address string, limit int) []UserAction {
	timescaleClient := timescale.Client()

	statementText := fmt.Sprintf(
		`SELECT
			event_number,
			type,
			transaction_hash,
			log_index,
			swap_in,
			sender_address,
			recipient_address,
			amount,
			time,
			token_short_name,
			token_decimals,
			solana_sender_owner_address,
			solana_recipient_owner_address

		FROM %v
		WHERE network = $1
		AND (solana_sender_owner_address = $2
			OR solana_recipient_owner_address = $2)
		ORDER BY time DESC
		LIMIT $3`,

		TableUserActions,
	)

	rows, err := timescaleClient.Query(
		statementText,
		network,
		address,
		limit,
	)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Context = Context
			k.Message = "Failed to get user actions with a spender address!"
			k.Payload = err
		})
	}

	defer rows.Close()

	userActions := make([]UserAction, 0)

	for rows.Next() {
		preCastUserAction := UserActionDb{
			userAction: UserAction{
				Network: network,
			},
		}

		userAction := preCastUserAction.userAction

		var solanaSenderOwnerAddress, solanaRecipientOwnerAddress sql.NullString

		err := rows.Scan(
			&userAction.EventNumber,
			&userAction.Type,
			&userAction.TransactionHash,
			&userAction.LogIndex,
			&userAction.SwapIn,
			&userAction.SenderAddress,
			&userAction.RecipientAddress,
			&preCastUserAction.amountString,
			&userAction.Time,
			&userAction.TokenDetails.TokenShortName,
			&userAction.TokenDetails.TokenDecimals,
			&solanaSenderOwnerAddress,
			&solanaRecipientOwnerAddress,
		)

		if err != nil {
			log.Fatal(func(k *log.Log) {
				k.Context = Context
				k.Message = "Failed to scan a user action row filtered by spender address!"
				k.Payload = err
			})
		}

		userAction.SolanaSenderOwnerAddress = solanaSenderOwnerAddress.String
		userAction.SolanaRecipientOwnerAddress = solanaRecipientOwnerAddress.String

		// Cast string amount from database to BigInt
		amount, err := misc.BigIntFromString(preCastUserAction.amountString)
		if err != nil {
			log.Fatal(func(k *log.Log) {
				k.Context = Context
				k.Message = "Failed to cast user action amount from db!"
				k.Payload = err
			})
		}

		userAction.Amount = *amount

		userActions = append(userActions, userAction)
	}

	return userActions
}

func CountUniqueDailyUsers(network network.BlockchainNetwork) uint64 {
	timescaleClient := timescale.Client()

	statementText := fmt.Sprintf(
		`SELECT
			COUNT(DISTINCT sender_address)
		FROM %v
		WHERE network = $1
		AND time > CURRENT_TIMESTAMP - INTERVAL '24 HOURS'`,

		TableUserActions,
	)

	row := timescaleClient.QueryRow(statementText, network)

	var uniqueUsers uint64

	if err := row.Scan(&uniqueUsers); err != nil {
		log.Fatal(func(k *log.Log) {
			k.Context = Context

			k.Format(
				"Failed to count daily unique users for network %s!",
				network,
			)

			k.Payload = err
		})
	}

	return uniqueUsers
}

func GetUserActions(f func(userAction UserAction)) {
	timescaleClient := timescale.Client()

	statementText := fmt.Sprintf(
		`SELECT
			event_number,
			type,
			transaction_hash,
			log_index,
			swap_in,
			sender_address,
			recipient_address,
			amount,
			time,
			token_short_name,
			token_decimals,
			solana_sender_owner_address,
			solana_recipient_owner_address

		FROM %v`,

		TableUserActions,
	)

	rows, err := timescaleClient.Query(statementText)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Context = Context
			k.Message = "Failed to get all the user actions in the database!"
			k.Payload = err
		})
	}

	defer rows.Close()

	for rows.Next() {
		var (
			preCastUserAction UserActionDb

			solanaSenderOwnerAddress, solanaRecipientOwnerAddress sql.NullString
		)

		userAction := preCastUserAction.userAction

		err = rows.Scan(
			&userAction.EventNumber,
			&userAction.Type,
			&userAction.TransactionHash,
			&userAction.LogIndex,
			&userAction.SwapIn,
			&userAction.SenderAddress,
			&userAction.RecipientAddress,
			&userAction.Amount,
			&userAction.Time,
			&userAction.TokenDetails.TokenShortName,
			&userAction.TokenDetails.TokenDecimals,
			&solanaSenderOwnerAddress,
			&solanaRecipientOwnerAddress,
		)

		if err != nil {
			log.Fatal(func(k *log.Log) {
				k.Context = Context
				k.Message = "Failed to scan a user action in getting all of them!"
				k.Payload = err
			})
		}

		userAction.SolanaSenderOwnerAddress = solanaSenderOwnerAddress.String
		userAction.SolanaRecipientOwnerAddress = solanaRecipientOwnerAddress.String

		// Cast string amount from database to BigInt
		amount, err := misc.BigIntFromString(preCastUserAction.amountString)
		if err != nil {
			log.Fatal(func(k *log.Log) {
				k.Context = Context
				k.Message = "Failed to cast user action amount from db!"
				k.Payload = err
			})
		}

		userAction.Amount = *amount

		f(userAction)
	}
}

// GetUserActionByLogIndex to find a user action in a transaction that has the given log index
func GetUserActionByLogIndex(network network.BlockchainNetwork, transactionHash string, logIndex misc.BigInt) *user_actions.UserAction {
	timescaleClient := timescale.Client()

	statementText := fmt.Sprintf(
		`SELECT
			event_number,
			type,
			transaction_hash,
			log_index,
			swap_in,
			sender_address,
			recipient_address,
			amount,
			time,
			token_short_name,
			token_decimals,
			solana_sender_owner_address,
			solana_recipient_owner_address

		FROM %v
		WHERE network = $1
		AND transaction_hash = $2
		AND log_index = $3`,

		TableUserActions,
	)

	row := timescaleClient.QueryRow(
		statementText,
		network,
		transactionHash,
		logIndex,
	)

	preCastUserAction := UserActionDb{
		userAction: UserAction{
			Network: network,
		},
	}

	userAction := preCastUserAction.userAction

	err := row.Scan(
		&userAction.EventNumber,
		&userAction.Type,
		&userAction.TransactionHash,
		&userAction.LogIndex,
		&userAction.SwapIn,
		&userAction.SenderAddress,
		&userAction.RecipientAddress,
		&preCastUserAction.amountString,
		&userAction.Time,
		&userAction.TokenDetails.TokenShortName,
		&userAction.TokenDetails.TokenDecimals,
		&userAction.SolanaSenderOwnerAddress,
		&userAction.SolanaRecipientOwnerAddress,
	)

	if err != nil {
		if err == sql.ErrNoRows {
			return nil
		}

		log.Fatal(func(k *log.Log) {
			k.Context = Context
			k.Format(
				"Failed to scan a user action row filtered by network %v, transaction hash %v and log index %v!",
				network,
				transactionHash,
				logIndex.String(),
			)
			k.Payload = err
		})
	}

	// Cast string amount from database to BigInt
	amount, err := misc.BigIntFromString(preCastUserAction.amountString)
	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Context = Context
			k.Message = "Failed to cast user action amount from db!"
			k.Payload = err
		})
	}

	userAction.Amount = *amount

	return &userAction
}
