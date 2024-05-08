// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package fly_staked

import (
	"fmt"

	"github.com/fluidity-money/fluidity-app/lib/types/ethereum"
	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/timescale"
)

const (
	// Context to use for database logging
	Context = "TIMESCALE/FLY_STAKED"

	// TableFlyStaked to use to get the currently staked users
	TableFlyStaked = "fly_staked"
)

// PickSenderAndReceiver by randomly picking 10 stakers, then taking the
// top 2 of them by staked amount. If we only find one, then we make them the
// recipient for everything. If we can't find anything, we Fatal. This only makes
// sense with a large dataset (everything else
func PickSenderAndReceiver() (sender ethereum.Address, receiver ethereum.Address) {
	timescaleClient := timescale.Client()

	statementText := fmt.Sprintf(
		`
		WITH total AS (
			SELECT COUNT(*) as cnt FROM %v
		),
		sampling AS (
			SELECT CASE
				WHEN cnt < 10 THEN 100
				ELSE (10.0 / cnt * 100)
			END AS sample_percent
			FROM total
		)
		SELECT * FROM (
			SELECT * FROM %v
			TABLESAMPLE BERNOULLI ((SELECT sample_percent FROM sampling))
		) AS sampled_rows
		ORDER BY amount DESC
		LIMIT 2;
		`,
		TableFlyStaked,
		TableFlyStaked,
	)

	rows, err := timescaleClient.Query(statementText)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Context = Context
			k.Message = "Failed to query for top 10 stakers with limit 2"
			k.Payload = err
		})
	}

	defer rows.Close()

	if !rows.Next() {
		log.Fatal(func(k *log.Log) {
			k.Context = Context
			k.Message = "No rows for top 10 stakers!"
		})
	}

	if err := rows.Scan(&sender); err != nil {
		log.Fatal(func(k *log.Log) {
			k.Context = Context
			k.Message = "Failed to scan sender!"
			k.Payload = err
		})
	}

	if rows.Next() {
		if err := rows.Scan(&receiver); err != nil {
			log.App(func(k *log.Log) {
				k.Context = Context
				k.Message = "Unable to scan the receiver!"
				k.Payload = err
			})
		}
	} else {
		log.App(func(k *log.Log) {
			k.Context = Context
			k.Message = "No row for the receiver for the stakers."
		})
	}

	return sender, receiver
}
