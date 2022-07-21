// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE file.

package payout

import (
	"fmt"

	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/postgres"
	types "github.com/fluidity-money/fluidity-app/lib/types/payout"
)

const (
	// Context to use when logging
	ContextUtilityGauge = `POSTGRES/UTILITY_GAUGE`

	// TableTrfVars is the table to store trf vars for the workers
	TableUtilityGauge = `utility_gauges`

	// TableTrfVars is the table to store trf vars for the workers
	TableWhitelistedGauges = `whitelisted_gauges`
)

type UtilityGaugePower = types.UtilityGaugePower

func InsertUtilityGauge(utilityGauge UtilityGaugePower) {
	var (
		chain   = utilityGauge.Chain
		network = utilityGauge.Network
		gauge   = utilityGauge.Gauge

		epoch      = utilityGauge.Epoch
		disabled   = utilityGauge.Disabled
		totalPower = utilityGauge.TotalPower
	)

	postgresClient := postgres.Client()

	statementText := fmt.Sprintf(
		`INSERT INTO %s (
			chain,
			network,
			gauge,
			epoch,
			disabled,
			total_power
		)
		VALUES (
			$1,
			$2,
			$3,
			$4,
			$5,
			$6,
		)
		ON CONFLICT (gauge) DO UPDATE
		SET 
			epoch = EXCLUDED.epoch,
			disabled = EXCLUDED.disabled
			total_power = EXCLUDED.total_power`,
		TableUtilityGauge,
	)

	_, err := postgresClient.Exec(
		statementText,
		chain,
		network,
		gauge,
		epoch,
		disabled,
		totalPower,
	)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Context = ContextUtilityGauge
			k.Message = "failed to insert new utility-gauge!"
			k.Payload = err
		})
	}
}

func GetLatestUtilityGauges(network string) []UtilityGaugePower {
	postgresClient := postgres.Client()

	// fetch the daily average for each day we have data for
	statementText := fmt.Sprintf(
		`SELECT
			chain,
			network,
			gauge,
			epoch,
			disabled,
			total_power
		FROM %s
		WHERE network = '%s'`,
		TableUtilityGauge,
		network,
	)

	rowsUtilityGauge, err := postgresClient.Query(statementText)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Context = ContextTrf
			k.Message = "failed to fetch utility-gauge!"
			k.Payload = err
		})
	}

	defer rowsUtilityGauge.Close()

	var utilityGauges = make([]UtilityGaugePower, 0)

	for rowsUtilityGauge.Next() {
		var utilityGauge UtilityGaugePower

		err := rowsUtilityGauge.Scan(
			&utilityGauge.Chain,
			&utilityGauge.Network,
			&utilityGauge.Gauge,
			&utilityGauge.Epoch,
			&utilityGauge.Disabled,
			&utilityGauge.TotalPower,
		)

		if err != nil {
			log.Fatal(func(k *log.Log) {
				k.Context = ContextTrf
				k.Message = "failed to scan utility gauges!"
				k.Payload = err
			})
		}

		utilityGauges = append(utilityGauges, utilityGauge)
	}

	return utilityGauges
}

// InsertWhitelistedGauge inserts new gauge into postgres
func InsertWhitelistedGauge(gauge string) {
	postgresClient := postgres.Client()

	statementText := fmt.Sprintf(
		`INSERT INTO %s (
			gauge,
		)
		VALUES (
			$1,
		)`,
		TableWhitelistedGauges,
	)

	_, err := postgresClient.Exec(
		statementText,
		gauge,
	)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Context = ContextUtilityGauge
			k.Message = "failed to insert new whitelisted gauge!"
			k.Payload = err
		})
	}
}

func GetWhitelistedGauges() []string {
	postgresClient := postgres.Client()

	statementText := fmt.Sprintf(
		`SELECT
			gauge
		FROM %s`,
		TableWhitelistedGauges,
	)

	rowsWhitelist, err := postgresClient.Query(statementText)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Context = ContextTrf
			k.Message = "failed to fetch whitelisted-gauges!"
			k.Payload = err
		})
	}

	defer rowsWhitelist.Close()

	var whitelistedGauges = make([]string, 0)

	for rowsWhitelist.Next() {
		var whitelistedGauge string

		err := rowsWhitelist.Scan(
			&whitelistedGauge,
		)

		if err != nil {
			log.Fatal(func(k *log.Log) {
				k.Context = ContextTrf
				k.Message = "failed to scan whitelisted-gauges!"
				k.Payload = err
			})
		}

		whitelistedGauges = append(whitelistedGauges, whitelistedGauge)
	}

	return whitelistedGauges
}
