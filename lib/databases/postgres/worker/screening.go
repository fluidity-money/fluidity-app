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

// GetEllipticScreeningIsRisky cache from the database to precede a
// request to Elliptic presumably
func GetEllipticScreeningIsRisky(network_ network.BlockchainNetwork, address ethereum.Address) (isRisky bool, cached bool) {
	postgresClient := postgres.Client()

	statementText := fmt.Sprintf(`
		SELECT risky
		FROM %s
		WHERE network = $1 AND address = $2`,

		TableEllipticScreening,
	)

	row := postgresClient.QueryRow(statementText, network_, address)

	if err := row.Err(); err != nil {
		log.Fatal(func(k *log.Log) {
			k.Context = Context
			k.Message = "Failed to get Elliptic screening cache!"
			k.Payload = err
		})
	}

	switch err := row.Scan(&isRisky); err {
	case sql.ErrNoRows:
		return false, false

	case nil:
		// do nothing

	default:
		log.Fatal(func(k *log.Log) {
			k.Context = Context
			k.Message = "Failed to decode screening row!"
			k.Payload = err
		})
	}

	return isRisky, true
}

// InsertEllipticScreening to the database cache
func InsertEllipticScreening(network_ network.BlockchainNetwork, address ethereum.Address, isRisky bool) {
	postgresClient := postgres.Client()

	statementText := fmt.Sprintf(`
		INSERT INTO %s (network, address, risky) VALUES (
			$1,
			$2,
			$3
		)`,

		TableEllipticScreening,
	)

	_, err := postgresClient.Exec(statementText, network_, address, isRisky)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Context = Context

			k.Format(
				"Failed to insert the riskiness of an address, network %v, address %#v!",
				network_,
				address,
			)
		})
	}
}
