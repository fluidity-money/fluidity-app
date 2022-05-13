package spooler

import (
	"database/sql"
	"fmt"
	"math/big"

	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/timescale"
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

func InsertPendingWinner(winner worker.EthereumWinnerAnnouncement) {
	timescaleClient := timescale.Client()

	var (
		tokenDetails = winner.TokenDetails

		tokenShortName = tokenDetails.TokenShortName
		hash = winner.TransactionHash
		senderAddress = winner.FromAddress
		recipientAddress = winner.ToAddress
		winAmount = winner.WinAmount
	)

	statementText := fmt.Sprintf(
		`INSERT INTO %s (
			token_short_name,
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
			$5
		);`,

		TablePendingWinners,
	)

	_, err := timescaleClient.Exec(
		statementText,
		tokenShortName,
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

func GetAndRemoveRewardsForToken(token token_details.TokenDetails) []worker.EthereumWinnerAnnouncement {
	timescaleClient := timescale.Client()

	statementText := fmt.Sprintf(
		`UPDATE %s
			SET reward_sent = true
		WHERE
			reward_send = false
			AND token_short_name = $1
		RETURNING
			transaction_hash,
			sender_address,
			recipient_address,
			win_amount
		);`,

		TablePendingWinners,
	)

	rows, err := timescaleClient.Query(
		statementText,
		token.TokenShortName,
	)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Context = Context

			k.Format(
				"Failed to fetch and mark winners as sent for token %s!",
				token.TokenShortName,
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
		winner.TokenDetails = token

		err := rows.Scan(
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
