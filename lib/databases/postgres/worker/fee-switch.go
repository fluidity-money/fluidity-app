// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package worker

import (
	"database/sql"
	"fmt"

	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/postgres"
	"github.com/fluidity-money/fluidity-app/lib/types/ethereum"
	"github.com/fluidity-money/fluidity-app/lib/types/network"
)

func GetFeeSwitch(originalAddress ethereum.Address, network_ network.BlockchainNetwork) *FeeSwitch {
	postgresClient := postgres.Client()

	statementText := fmt.Sprintf(`
		SELECT new_address
		FROM %s
		WHERE network = $1 AND original_address = $2`,

		TableFeeSwitch,
	)

	row := postgresClient.QueryRow(statementText, network_, originalAddress.String())

	if err := row.Err(); err != nil {
		log.Fatal(func(k *log.Log) {
			k.Context = Context
			k.Message = "Failed to get fee switch config!"
			k.Payload = err
		})
	}

	feeSwitch := FeeSwitch{
		OriginalAddress: originalAddress,
		Network:         network_,
	}

	switch err := row.Scan(&feeSwitch.NewAddress); err {
	case sql.ErrNoRows:
		return nil

	default:
		log.Fatal(func(k *log.Log) {
			k.Context = Context
			k.Message = "Failed to decode fee switch code!"
			k.Payload = err
		})
	}

	return &feeSwitch
}
