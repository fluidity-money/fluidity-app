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
		chain            = calculateNArgs.Chain
		network          = calculateNArgs.Network
		payoutFreqNum    = calculateNArgs.PayoutFreqNum
		payoutFreqDenom  = calculateNArgs.PayoutFreqDenom
		deltaWeightNum   = calculateNArgs.DeltaWeightNum
		deltaWeightDenom = calculateNArgs.DeltaWeightDenom
		winningClasses   = calculateNArgs.WinningClasses
	)

	timescaleClient := timescale.Client()

	statementText := fmt.Sprintf(
		`INSERT INTO %s (
			chain,
			network,
			payout_freq_num,
			payout_freq_denom,
			delta_weight_num,
			delta_weight_denom,
			winning_classes
		)
		VALUES (
			$1,
			$2,
			$3,
			$4,
			$5,
			$6,
			$7
		)`,

		TableCalculateN,
	)

	_, err := timescaleClient.Exec(
		statementText,
		chain,
		network,
		payoutFreqNum,
		payoutFreqDenom,
		deltaWeightNum,
		deltaWeightDenom,
		winningClasses,
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
			payout_freq_num,
			payout_freq_denom,
			delta_weight_num,
			delta_weight_denom,
			winning_classes
		FROM %s
		WHERE chain = '%s' AND network = '%s'
		ORDER BY time DESC
		LIMIT 1`,

		TableCalculateN,
		chain,
		network,
	)

	rowsCalculateNArgs := timescaleClient.QueryRow(statementText)

	var calculateNArgs TribecaProgramData

	err := rowsCalculateNArgs.Scan(
		&calculateNArgs.Chain,
		&calculateNArgs.Network,
		&calculateNArgs.PayoutFreqNum,
		&calculateNArgs.PayoutFreqDenom,
		&calculateNArgs.DeltaWeightNum,
		&calculateNArgs.DeltaWeightDenom,
		&calculateNArgs.WinningClasses,
	)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Context = Context
			k.Message = "Failed to scan past calculateN args!"
			k.Payload = err
		})
	}

	return calculateNArgs
}
