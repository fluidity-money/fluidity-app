package payout

import (
	"fmt"

	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/postgres"
	"github.com/fluidity-money/fluidity-app/lib/types/payout"
)

const (
	// Context to use when logging
	ContextUtilityGauge = `POSTGRES/UTILITY_GAUGE`

	// TableTrfVars is the table to store trf vars for the workers
	TableUtilityGauge = `utility_gauges`
)

type UtilityGaugePower = payout.UtilityGaugePower

func InsertTrfVars(utilityGauge UtilityGaugePower) {
	var (
		network  = utilityGauge.Network
		protocol = utilityGauge.Protocol

		epoch      = utilityGauge.Epoch
		totalPower = utilityGauge.TotalPower
	)

	postgresClient := postgres.Client()

	statementText := fmt.Sprintf(
		`INSERT INTO %s (
			network,
			protocol,
			epoch,
			total_power
		)
		VALUES (
			$1,
			$2,
			$3,
			$4,
		)
		ON CONFLICT (protocol) DO UPDATE
		SET 
			epoch = EXCLUDED.epoch,
			total_power = EXCLUDED.total_power`,
		TableUtilityGauge,
	)

	_, err := postgresClient.Exec(
		statementText,
		network,
		protocol,
		epoch,
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

func GetLatestUtilityGaugesVars(network string) []UtilityGaugePower {
	postgresClient := postgres.Client()

	// fetch the daily average for each day we have data for
	statementText := fmt.Sprintf(
		`SELECT
			network,
			protocol,
			epoch,
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
			&utilityGauge.Network,
			&utilityGauge.Protocol,
			&utilityGauge.Epoch,
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
