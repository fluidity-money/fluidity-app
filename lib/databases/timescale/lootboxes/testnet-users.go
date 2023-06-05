// Copyright 2023 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package lootboxes

import (
	"database/sql"
	"fmt"

	"github.com/fluidity-money/fluidity-app/common/ethereum/fluidity"
	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/timescale"
)

const (
	// TableTestnetAddress that contains a list of addresses used in the testnet
	TableTestnetAddress = `testnet_address`

	// TableTestnetOwner to insert a mainnet owner -> testnet address relation
	TableTestnetOwner   = `testnet_owner`
)


// InsertTestnetOwner to insert an owner -> address relation into Timescale
// given that the address is found to be a testnet user
// return true if the address is an unowned testnet user, otherwise false
func InsertTestnetOwner(ownerPair fluidity.TestnetOwnerPair) bool {
	timescaleClient := timescale.Client()

	statementText := fmt.Sprintf(
		`INSERT INTO %[1]s (
			owner,
			testnet_address
		) SELECT 
			$1, 
			$2
		WHERE EXISTS(
			SELECT 1 FROM %[2]s 
			WHERE address = $3
		) AND NOT EXISTS(
			SELECT 1 FROM %[1]s 
			WHERE testnet_address = $4
		) RETURNING owner`,
		TableTestnetOwner,
		TableTestnetAddress,
	)

	var (
		ownerString			 = ownerPair.Owner.String()
		testnetAddressString = ownerPair.TestnetAddress.String()
	)

	// using $2 multiple times fails with a postgres type error, so duplicate the param
	row := timescaleClient.QueryRow(
		statementText,
		ownerString,
		testnetAddressString,
		testnetAddressString,
		testnetAddressString,
	)

	var owner_ string 

	err := row.Scan(&owner_)

	// testnet address wasn't found or was already owned
	if err == sql.ErrNoRows {
		return false
	}

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Context = Context

			k.Format(
				"Failed to insert testnet owner %v of address %v!",
				ownerPair.Owner,
				ownerPair.TestnetAddress,
			)

			k.Payload = err
		})
	}

	return true
}
