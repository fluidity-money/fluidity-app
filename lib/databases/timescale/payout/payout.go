package payout

import (
	"fmt"

	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/timescale"
	"github.com/fluidity-money/fluidity-app/lib/types/solana"
)

const (
	// Context to use when logging
	Context = `TIMESCALE/PAYOUT`

	// TableCalculateN is the table to store calculaten args in
	TableCalculateN = `calculaten_args`
)

type TribecaProgramData = solana.TribecaProgramData

func InsertNArgs(calculateNArgs TribecaProgramData) {
	timescaleClient := timescale.Client()

	statementText := fmt.Sprintf(
		`INSERT INTO %s (
			crunchy,
			smooth,
			network
		)

		VALUES (
			$1,
			$2,
			$3
		)`,

		TableCalculateN,
	)

	_, err := timescaleClient.Exec(
		statementText,
		calculateNArgs.Crunchy,
		calculateNArgs.Smooth,
		calculateNArgs.Network,
	)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Context = Context
			k.Message = "Failed to insert calculateN update!"
			k.Payload = err
		})
	}
}

func GetLatestCalculatenArgs() TribecaProgramData {
	timescaleClient := timescale.Client()

	// fetch the daily average for each day we have data for
	statementText := fmt.Sprintf(
		`SELECT
			crunchy,
			smooth
		FROM %s
		ORDER BY time DESC
		LIMIT 1`,

		TableCalculateN,
	)

	rowsCalculateNArgs, err := timescaleClient.Query(statementText)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Context = Context
			k.Message = "Failed to get latest calculateN args!"
			k.Payload = err
		})
	}

	defer rowsCalculateNArgs.Close()

	calculateNArgs := make([]TribecaProgramData, 0)

	for rowsCalculateNArgs.Next() {
		var data TribecaProgramData

		err = rowsCalculateNArgs.Scan(
			&data.Crunchy,
			&data.Smooth,
		)

		if err != nil {
			log.Fatal(func(k *log.Log) {
				k.Context = Context
				k.Message = "Failed to scan past calculateN args!"
				k.Payload = err
			})
		}

		calculateNArgs = append(calculateNArgs, data)

	}
	fmt.Println(calculateNArgs)

	if len(calculateNArgs) != 1 {
		log.Fatal(func(k *log.Log) {
			k.Context = Context
			k.Format("Timescale query for calculateN args returned %v entries!", len(calculateNArgs))
			k.Payload = err
		})
	}

	return calculateNArgs[0]
}
