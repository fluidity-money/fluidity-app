// Copyright 2023 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package lootboxes

import (
	"fmt"

	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/timescale"
	"github.com/fluidity-money/fluidity-app/lib/types/applications"
	"github.com/fluidity-money/fluidity-app/lib/types/ethereum"
	types "github.com/fluidity-money/fluidity-app/lib/types/lootboxes"
)

const (
	// Context to use for logging
	Context = `TIMESCALE/LOOTBOXES`

	// TableLootboxes to use when inserting
	// derived lootboxes to database
	TableLootboxes = `lootbox`

	// TableLootboxConfig to use for setting configuration
	// for the currently running epoch
	TableLootboxConfig = `lootbox_config`

	// TableLootboxAmountsRewarded to use for tracking cumulative
	// amounts earned by users during a lootbox campaign
	TableLootboxAmountsRewarded = `lootbox_amounts_rewarded`
)

type Lootbox = types.Lootbox

// InsertLootbox inserts a Lootbox into the database
func InsertLootbox(lootbox Lootbox, currentEpoch string) {
	timescaleClient := timescale.Client()

	statementText := fmt.Sprintf(
		`INSERT INTO %s (
			address,
			source,
			transaction_hash,
			awarded_time,
			volume,
			reward_tier,
			lootbox_count,
			application,
			epoch
		)

		VALUES (
			$1,
			$2,
			$3,
			$4,
			$5,
			$6,
			$7,
			$8,
			$9
		)`,

		TableLootboxes,
	)

	_, err := timescaleClient.Exec(
		statementText,
		lootbox.Address,
		lootbox.Source,
		lootbox.TransactionHash,
		lootbox.AwardedTime,
		lootbox.Volume,
		lootbox.RewardTier,
		lootbox.LootboxCount,
		lootbox.Application.String(),
		lootbox.Epoch,
	)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Context = Context
			k.Message = "Failed to insert transaction attributes!"
			k.Payload = err
		})
	}
}

// GetLootboxes gets all Lootboxes earned by address, limited by a number
func GetLootboxes(address ethereum.Address, currentEpoch string, limit int) []Lootbox {
	timescaleClient := timescale.Client()

	statementText := fmt.Sprintf(
		`SELECT
			address,
			source,
			transaction_hash,
			awarded_time,
			volume,
			reward_tier,
			lootbox_count,
			application

		FROM %s
		WHERE address = $1 AND epoch = $2
		LIMIT $3
		`,

		TableLootboxes,
	)

	rows, err := timescaleClient.Query(
		statementText,
		address,
		currentEpoch,
		limit,
	)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Context = Context

			k.Format(
				"Failed to get the lootboxes with a count of %v!",
				limit,
			)

			k.Payload = err
		})
	}

	defer rows.Close()

	lootboxes := make([]Lootbox, 0)

	for rows.Next() {
		var (
			lootbox      Lootbox
			application_ string
		)

		err := rows.Scan(
			&lootbox.Address,
			&lootbox.Source,
			&lootbox.TransactionHash,
			&lootbox.AwardedTime,
			&lootbox.Volume,
			&lootbox.RewardTier,
			&lootbox.LootboxCount,
			&application_,
		)

		if err != nil {
			log.Fatal(func(k *log.Log) {
				k.Context = Context
				k.Message = "Failed to scan a row of the lootboxes!"
				k.Payload = err
			})
		}

		lootbox.Epoch = currentEpoch

		application, err := applications.ParseApplicationName(application_)

		if err != nil {
			log.Fatal(func(k *log.Log) {
				k.Context = Context

				k.Format(
					"Fetched invalid application name %v!",
					application_,
				)

				k.Payload = err
			})
		}

		lootbox.Application = application

		lootboxes = append(lootboxes, lootbox)
	}

	return lootboxes
}
