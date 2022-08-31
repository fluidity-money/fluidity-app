// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package payout

import (
	"fmt"

	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/postgres"
	"github.com/fluidity-money/fluidity-app/lib/types/payout"
)

const (
	// Context to use when logging
	ContextTrf = `POSTGRES/TRF`

	// TableTrfVars is the table to store trf vars for the workers
	TableTrfVars = `trf_vars`
)

type TrfVars = payout.TrfVars

func InsertTrfVars(trfVars TrfVars) {
	var (
		chain            = trfVars.Chain
		network          = trfVars.Network
		payoutFreqNum    = trfVars.PayoutFreqNum
		payoutFreqDenom  = trfVars.PayoutFreqDenom
		deltaWeightNum   = trfVars.DeltaWeightNum
		deltaWeightDenom = trfVars.DeltaWeightDenom
		winningClasses   = trfVars.WinningClasses
	)

	postgresClient := postgres.Client()

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
		)
		ON CONFLICT (chain, network) DO UPDATE
		SET 
			payout_freq_num = EXCLUDED.payout_freq_num,
			payout_freq_denom = EXCLUDED.payout_freq_denom,
			delta_weight_num = EXCLUDED.delta_weight_num,
			delta_weight_denom = EXCLUDED.delta_weight_denom,
			winning_classes = EXCLUDED.winning_classes`,
		TableTrfVars,
	)

	_, err := postgresClient.Exec(
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
			k.Context = ContextTrf
			k.Message = "failed to insert new trf-vars!"
			k.Payload = err
		})
	}
}

func GetLatestTrfVars(chain, network string) TrfVars {
	postgresClient := postgres.Client()

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
		WHERE chain = '%s' AND network = '%s'`,
		TableTrfVars,
		chain,
		network,
	)

	rowsTrfVars := postgresClient.QueryRow(statementText)

	var trfVars TrfVars

	err := rowsTrfVars.Scan(
		&trfVars.Chain,
		&trfVars.Network,
		&trfVars.PayoutFreqNum,
		&trfVars.PayoutFreqDenom,
		&trfVars.DeltaWeightNum,
		&trfVars.DeltaWeightDenom,
		&trfVars.WinningClasses,
	)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Context = ContextTrf
			k.Message = "failed to scan past trf-vars!"
			k.Payload = err
		})
	}

	return trfVars
}
