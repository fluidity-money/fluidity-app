// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package airdrop

// staking is an action to boost liquidity multipliers, tracked by an event on-chain.

import (
	"fmt"

	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/timescale"
	"github.com/fluidity-money/fluidity-app/lib/types/ethereum"
)

const (
	// Context to use for logging
	Context = `TIMESCALE/AIRDROP`

	// TableStakingEvents to use to record emitted staking events
	TableStakingEvents = `staking_events`
)


func InsertStakingEvent(stakingEvent ethereum.StakingEvent) {
	timescaleClient := timescale.Client()

	var (
		address      = stakingEvent.Address
		usdAmount    = stakingEvent.UsdAmount
		lockupLength = stakingEvent.LockupLength
		insertedDate = stakingEvent.InsertedDate

		statementText string
	)

    statementText = fmt.Sprintf(
        `INSERT INTO %s (
            address,
            usd_amount,
            lockup_length,
            inserted_date
         ) VALUES (
			$1,
			$2,
			$3,
			$4
		);`,
        TableStakingEvents,
    )

	_, err := timescaleClient.Exec(
		statementText,
        address,
        usdAmount,
        lockupLength,
        insertedDate,
	)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Context = Context
			k.Message = "Failed to insert a staking event!"
			k.Payload = err
		})
	}
}

// GetCurrentStakingEvents to fetch staking events that are currently active
func GetCurrentStakingEvents() []ethereum.StakingEvent {
	timescaleClient := timescale.Client()

	statementText := fmt.Sprintf(
		`SELECT
			address,
			usd_amount,
			lockup_length,
			inserted_date
		FROM %v
		WHERE inserted_date + (lockup_length || ' DAYS')::INTERVAL > NOW()`,

		TableStakingEvents,
	)

	rows, err := timescaleClient.Query(
		statementText,
	)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Context = Context
			k.Message = "Failed to get the active staking events!"
			k.Payload = err
		})
	}

	defer rows.Close()

	stakingEvents := make([]ethereum.StakingEvent, 0)

	for rows.Next() {
		var (
			stakingEvent ethereum.StakingEvent
		)

		err := rows.Scan(
			&stakingEvent.Address,
			&stakingEvent.UsdAmount,
			&stakingEvent.LockupLength,
			&stakingEvent.InsertedDate,
		)

		if err != nil {
			log.Fatal(func(k *log.Log) {
				k.Context = Context
				k.Message = "Failed to scan a row of staking events!"
				k.Payload = err
			})
		}

		stakingEvents = append(stakingEvents, stakingEvent)
	}

	return stakingEvents 
}
