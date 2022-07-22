package winners

// winners is a winner tracked by an event on-chain.

import (
	"database/sql"
	"fmt"
	"time"

	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/timescale"
	"github.com/fluidity-money/fluidity-app/lib/types/misc"
	"github.com/fluidity-money/fluidity-app/lib/types/network"
	"github.com/fluidity-money/fluidity-app/lib/types/winners"
)

const (
	// Context to use for logging
	Context = `TIMESCALE/WINNERS`

	// TableWinners to use to record winners based on the contract calls
	TableWinners = `winners`
)

type Winner = winners.Winner

func InsertWinner(winner Winner) {
	timescaleClient := timescale.Client()

	var (
		tokenShortName = winner.TokenDetails.TokenShortName
		tokenDecimals  = winner.TokenDetails.TokenDecimals
	)

	statementText := fmt.Sprintf(
		`INSERT INTO %s (
			network,
			transaction_hash,
			winning_address,
			solana_winning_owner_address,
			winning_amount,
			awarded_time,
			token_short_name,
			token_decimals
		)

		VALUES (
			$1,
			$2,
			$3,
			$4,
			$5,
			$6,
			$7,
			$8
		);`,

		TableWinners,
	)

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
func GetLatestWinners(network network.BlockchainNetwork, limit int) []Winner {
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
			solana_winning_owner_address

		FROM %v
		WHERE network = $1
		ORDER BY awarded_time DESC
		LIMIT $2`,

		TableWinners,
	)

	rows, err := timescaleClient.Query(
		statementText,
		network,
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
		)

		if err != nil {
			log.Fatal(func(k *log.Log) {
				k.Context = Context
				k.Message = "Failed to scan a row of the latest winners!"
				k.Payload = err
			})
		}

		winner.SolanaWinnerOwnerAddress = solanaWinnerOwnerAddress.String

		winners = append(winners, winner)
	}

	return winners
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
