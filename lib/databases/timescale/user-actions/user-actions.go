package user_actions

import (
	"database/sql"
	"fmt"

	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/timescale"
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
			$12
		)`,

		TableUserActions,
	)

	_, err := timescaleClient.Exec(
		statementText,
		userAction.EventNumber,
		userAction.Network,
		userAction.Type,
		userAction.TransactionHash,
		userAction.SwapIn,
		userAction.SenderAddress,
		userAction.RecipientAddress,
		userAction.Amount,
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
		userAction := UserAction{
			Network: network,
		}

		var solanaSenderOwnerAddress, solanaRecipientOwnerAddress sql.NullString

		err := rows.Scan(
			&userAction.EventNumber,
			&userAction.Type,
			&userAction.TransactionHash,
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
				k.Message = "Failed to scan a user action row filtered by spender address!"
				k.Payload = err
			})
		}

		userAction.SolanaSenderOwnerAddress = solanaSenderOwnerAddress.String
		userAction.SolanaRecipientOwnerAddress = solanaRecipientOwnerAddress.String

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
		userAction := UserAction{
			Network: network,
		}

		var solanaSenderOwnerAddress, solanaRecipientOwnerAddress sql.NullString

		err := rows.Scan(
			&userAction.EventNumber,
			&userAction.Type,
			&userAction.TransactionHash,
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
				k.Message = "Failed to scan a user action row filtered by spender address!"
				k.Payload = err
			})
		}

		userAction.SolanaSenderOwnerAddress = solanaSenderOwnerAddress.String
		userAction.SolanaRecipientOwnerAddress = solanaRecipientOwnerAddress.String

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
			userAction UserAction

			solanaSenderOwnerAddress, solanaRecipientOwnerAddress sql.NullString
		)

		err = rows.Scan(
			&userAction.EventNumber,
			&userAction.Type,
			&userAction.TransactionHash,
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

		f(userAction)
	}
}
