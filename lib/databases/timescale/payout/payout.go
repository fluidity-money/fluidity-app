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
	var (
		chain   = calculateNArgs.Chain
		network = calculateNArgs.Network
		delta   = calculateNArgs.Delta
		m       = calculateNArgs.M
		freqDiv = calculateNArgs.FreqDiv
	)

	timescaleClient := timescale.Client()

	statementText := fmt.Sprintf(
		`INSERT INTO %s (
			chain,
			network,
			delta,
			m,
			freq_div
		)

		VALUES (
			$1,
			$2,
			$3,
			$4,
			$5
		)`,

		TableCalculateN,
	)

	_, err := timescaleClient.Exec(
		statementText,
		chain,
		network,
		delta,
		m,
		freqDiv,
	)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Context = Context
			k.Message = "Failed to insert calculateN update!"
			k.Payload = err
		})
	}
}

func GetLatestCalculatenArgs(chain, network string) TribecaProgramData {
	timescaleClient := timescale.Client()

	// fetch the daily average for each day we have data for
	statementText := fmt.Sprintf(
		`SELECT
			chain,
			network,
			delta,
			m,
			freq_div
		FROM %s
		WHERE chain = %s AND network = %s
		ORDER BY time DESC
		LIMIT 1`,

		TableCalculateN,
		chain,
		network,
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

	var calculateNArgs TribecaProgramData

	rowsCalculateNArgs.Next()

	err = rowsCalculateNArgs.Scan(
		&calculateNArgs.Chain,
		&calculateNArgs.Network,
		&calculateNArgs.Delta,
		&calculateNArgs.M,
		&calculateNArgs.FreqDiv,
	)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Context = Context
			k.Message = "Failed to scan past calculateN args!"
			k.Payload = err
		})
	}

	fmt.Println(calculateNArgs)

	return calculateNArgs
}
