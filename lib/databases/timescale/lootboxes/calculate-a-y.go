// Copyright 2023 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package lootboxes

import (
	"time"

	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/timescale"
)

// Calculate_A_Y to determine the liquidity multiplier of an address
func Calculate_A_Y(address string, time time.Time) float64 {
	timescaleClient := timescale.Client()

	statementText := `
	SELECT 
		COALESCE(result, 0)
	FROM calculate_a_y(
		$1,
		$2
	)`

	rows, err := timescaleClient.Query(
		statementText,
		address,
		time,
	)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Context = Context

			k.Format(
				"Failed to call calculate_a_y with args (%v, %v)!",
				address,
				time,
			)

			k.Payload = err
		})
	}

	defer rows.Close()

	var liquidityMultiplier float64

	for rows.Next() {
		err := rows.Scan(
			&liquidityMultiplier,
		)

		if err != nil {
			log.Fatal(func(k *log.Log) {
				k.Context = Context
				k.Message = "Failed to scan a row of liquidity_result!"
				k.Payload = err
			})
		}
	}

	return liquidityMultiplier
}
