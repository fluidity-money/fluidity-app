// Copyright 2023 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package lootboxes

import (
	"database/sql"
	"fmt"

	"github.com/fluidity-money/fluidity-app/common/ethereum/applications"
	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/timescale"
)

const (
	Epoch1       = "epoch_1"
	Epoch2       = "epoch_2"
	Epoch3       = "epoch_3"
	EpochTesting = "epoch_testing"
)

// GetConfig that's currently marked as enabled, also getting whether the
// program has currently begun or not. Fatals if the number of rows returned
// exceeds 1.
func GetLootboxConfig() (programFound bool, hasBegun bool, curEpoch string, curApplication applications.Application) {
	timescaleClient := timescale.Client()

	statementText := fmt.Sprintf(
		`WITH t AS (
			SELECT CURRENT_TIMESTAMP AT TIME ZONE 'UTC' AS timestamp
		)
		SELECT
			program_begin < (select timestamp from t) AND
			program_end > (select timestamp from t),
			epoch_identifier,
			ethereum_application
		FROM %s
		WHERE is_current_program;`,

		TableLootboxConfig,
	)

	rows, err := timescaleClient.Query(statementText)

	switch err {
	case sql.ErrNoRows:
		return false, false, "", applications.ApplicationNone

	case nil:
		// do nothing

	default:
		log.Fatal(func(k *log.Log) {
			k.Context = Context
			k.Message = "Failed to query for lootbox config!"
			k.Payload = err
		})
	}

	defer rows.Close()

	if !rows.Next() {
		return false, false, "", applications.ApplicationNone
	}

	var applicationString string

	err = rows.Scan(&hasBegun, &curEpoch, &applicationString)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Context = Context
			k.Message = "Failed to query for lootbox config!"
			k.Payload = err
		})
	}

	curApplication, err = applications.ParseApplicationName(applicationString)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Context = Context

			k.Format(
				"Failed to parse the Ethereum application name %#v!",
				applicationString,
			)

			k.Payload = err
		})
	}

	if rows.Next() {
		log.Fatal(func(k *log.Log) {
			k.Context = Context
			k.Message = "Duplicate enabled row for the lootbox_config found!"
		})
	}

	return true, hasBegun, curEpoch, curApplication
}
