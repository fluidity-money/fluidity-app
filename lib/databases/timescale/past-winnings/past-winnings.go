package past_winnings

// past_winnings is the aggregated number of winners for a day

import (
	"github.com/fluidity-money/fluidity-app/lib/timescale"
	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/types/network"
	"github.com/fluidity-money/fluidity-app/lib/types/past-winnings"
	"fmt"
)

const (
	// Context to use when logging
	Context = `POSTGRES/PAST-WINNINGS`

	// TablePastWinnings to read from to get winnings in the past
	TablePastWinnings = `past_winnings`
)

type PastWinnings = past_winnings.PastWinnings

func GetPastWinnings(network network.BlockchainNetwork, amount int) (pastWinnings []PastWinnings) {
	databaseClient := timescale.Client()

	statementText := fmt.Sprintf(`
		SELECT *
			FROM (
				SELECT
					winning_date,
					amount_of_winners,
					winning_amount

				FROM %s
				WHERE network = $1
				ORDER BY winning_date DESC
				LIMIT $2
			) AS t

		ORDER BY winning_date ASC;
		`,

		TablePastWinnings,
	)

	rows, err := databaseClient.Query(statementText, network, amount)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Context = Context
			k.Message = "Failed to get the past winnings!"
			k.Payload = err
		})
	}

	defer rows.Close()

	pastWinnings = make([]PastWinnings, 0)

	for rows.Next() {
		var pastWinning PastWinnings

		err = rows.Scan(
			&pastWinning.WinningDate,
			&pastWinning.AmountOfWinners,
			&pastWinning.WinningAmount,
		)

		if err != nil {
			log.Fatal(func(k *log.Log) {
				k.Context = Context
				k.Message = "Failed to scan past winnings!"
				k.Payload = err
			})
		}

		pastWinnings = append(pastWinnings, pastWinning)
	}

	return pastWinnings
}

func InsertPastWinnings(pastWinnings PastWinnings) {
	databaseClient := timescale.Client()

	statementText := fmt.Sprintf(`
		INSERT INTO %s (
			network,
			winning_date,
			amount_of_winners,
			winning_amount
		)

		VALUES (
			$1,
			$2,
			$3,
			$4
		);
		`,

		TablePastWinnings,
	)

	_, err := databaseClient.Exec(
		statementText,
		pastWinnings.Network,
		pastWinnings.WinningDate,
		pastWinnings.AmountOfWinners,
		pastWinnings.WinningAmount,
	)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Context = Context
			k.Message = "Failed to insert a past winnings event!"
			k.Payload = err
		})
	}
}
