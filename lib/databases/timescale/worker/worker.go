package worker

import (
	"fmt"
	"database/sql"

	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/timescale"
	"github.com/fluidity-money/fluidity-app/lib/types/network"
)

const (
	// Context to use for logging
	Context = "TIMESCALE/WORKER"

	// TableAverageAtx to use to get the average ATX from
	TableAverageAtx = "worker_buffered_atx"
)

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
