package spooler

import (
	"database/sql"
	"fmt"
	"math/big"

	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/timescale"
	"github.com/fluidity-money/fluidity-app/lib/types/ethereum"
	"github.com/fluidity-money/fluidity-app/lib/types/misc"
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

type PendingWinner struct {
	TransactionHash ethereum.Hash
	FromAddress     ethereum.Address
	ToAddress       ethereum.Address
	WinAmount       *misc.BigInt
	TokenDetails    token_details.TokenDetails
	RewardSent      bool
}

func InsertPendingWinner(winner worker.EthereumWinnerAnnouncement) {
	timescaleClient := timescale.Client()

	var (
		tokenDetails = winner.TokenDetails

		tokenShortName = tokenDetails.TokenShortName
		tokenDecimals = tokenDetails.TokenDecimals
		hash = winner.TransactionHash
		senderAddress = winner.FromAddress
		recipientAddress = winner.ToAddress
		winAmount = winner.WinAmount
	)

	statementText := fmt.Sprintf(
		`INSERT INTO %s (
			token_short_name,
			token_decimals,
			transaction_hash,
			sender_address,
			recipient_address,
			win_amount
		)

		VALUES (
			$1,
			$2,
			$3,
			$4,
			$5,
			$6
		);`,

		TablePendingWinners,
	)

	_, err := timescaleClient.Exec(
		statementText,
		tokenShortName,
		tokenDecimals,
		hash,
		senderAddress,
		recipientAddress,
		winAmount,
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

func UnpaidWinningsForToken(token token_details.TokenDetails) *big.Int {
	timescaleClient := timescale.Client()

	statementText := fmt.Sprintf(
		`SELECT
			SUM(win_amount)

		FROM %s
		WHERE
			token_short_name = $1
			AND reward_sent = false
		`,

		TablePendingWinners,
	)

	row := timescaleClient.QueryRow(
		statementText,
		token.TokenShortName,
	)

	var total misc.BigInt

	err := row.Scan(&total)

	if err == sql.ErrNoRows {
		return big.NewInt(0)
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

	return &total.Int
}

func GetAndRemoveRewardsForToken(shortName string) []worker.EthereumWinnerAnnouncement {
	timescaleClient := timescale.Client()

	statementText := fmt.Sprintf(
		`UPDATE %s
			SET reward_sent = true
		WHERE
			reward_sent = false
			AND token_short_name = $1
		RETURNING
			token_short_name,
			token_decimals,
			transaction_hash,
			sender_address,
			recipient_address,
			win_amount
		;`,

		TablePendingWinners,
	)

	rows, err := timescaleClient.Query(
		statementText,
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

	winners := make([]worker.EthereumWinnerAnnouncement, 0)

	for rows.Next() {
		var (
			winner worker.EthereumWinnerAnnouncement
		)

		err := rows.Scan(
			&winner.TokenDetails.TokenShortName,
			&winner.TokenDetails.TokenDecimals,
			&winner.TransactionHash,
			&winner.FromAddress,
			&winner.ToAddress,
			&winner.WinAmount,
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

func GetPendingRewardsForAddress(address string) []worker.EthereumWinnerAnnouncement {
	timescaleClient := timescale.Client()

	statementText := fmt.Sprintf(
		`SELECT
			token_short_name,
			token_decimals,
			transaction_hash,
			sender_address,
			recipient_address,
			win_amount
		FROM %s
		WHERE
			reward_sent = false
			AND (sender_address = $1
				 OR recipient_address = $1)
		`,

		TablePendingWinners,
	)

	rows, err := timescaleClient.Query(
		statementText,
		address,
	)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Context = Context

			k.Format(
				"Failed to fetch unpaid winnings for user %s!",
				address,
			)

			k.Payload = err
		})
	}

	defer rows.Close()

	winners := make([]worker.EthereumWinnerAnnouncement, 0)

	for rows.Next() {
		var (
			winner worker.EthereumWinnerAnnouncement
		)

		err := rows.Scan(
			&winner.TokenDetails.TokenShortName,
			&winner.TokenDetails.TokenDecimals,
			&winner.TransactionHash,
			&winner.FromAddress,
			&winner.ToAddress,
			&winner.WinAmount,
		)

		if err != nil {
			log.Fatal(func(k *log.Log) {
				k.Context = Context
				k.Message = "Failed to scan a row of pending winners!"
				k.Payload = err
			})
		}

		winners = append(winners, winner)
	}

	return winners
}

func GetPendingRewardByHash(hash string) *PendingWinner {
	timescaleClient := timescale.Client()

	statementText := fmt.Sprintf(
		`SELECT
			token_short_name,
			token_decimals,
			transaction_hash,
			sender_address,
			recipient_address,
			win_amount,
			reward_sent
		FROM %s
		WHERE
			transaction_hash = $1
		`,

		TablePendingWinners,
	)

	row := timescaleClient.QueryRow(
		statementText,
		hash,
	)

	var response PendingWinner

	err := row.Scan(
		&response.TokenDetails.TokenShortName,
		&response.TokenDetails.TokenDecimals,
		&response.TransactionHash,
		&response.FromAddress,
		&response.ToAddress,
		&response.WinAmount,
		&response.RewardSent,
	)

	if err == sql.ErrNoRows {
		return nil
	}

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Context = Context

			k.Format(
				"Failed to get a pending winner with transaction hash %s!",
				hash,
			)

			k.Payload = err
		})
	}

	return &response
}

func RemovePendingWinner(hash string) {
	timescaleClient := timescale.Client()


	statementText := fmt.Sprintf(
		`UPDATE %s

		SET
			reward_sent = true
		WHERE
			transaction_hash = $1
		;`,

		TablePendingWinners,
	)

	_, err := timescaleClient.Exec(
		statementText,
		hash,
	)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Context = Context

			k.Format(
				"Failed to mark transaction with hash %s as rewarded!",
				hash,
			)

			k.Payload = err
		})
	}
}
