// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE file.

package faucet

// ethereum contains database code to use when interacting with the faucet
// deployed at https://faucet.fluidity.money

import (
	"database/sql"
	"fmt"
	"time"

	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/postgres"
	"github.com/fluidity-money/fluidity-app/lib/types/faucet"
	"github.com/fluidity-money/fluidity-app/lib/types/network"
)

const (
	// Context is the context printed during logging
	Context = `POSTGRES/FAUCET`

	// TableUsers to use to track faucet use from users
	TableUsers = "faucet_users"
)

type FaucetUser = faucet.FaucetUser

// GetUniqueAddress for the address given, returning nothing if nothing
// was found
func GetUniqueAddress(address string) string {
	postgresClient := postgres.Client()

	statementText := fmt.Sprintf(
		`SELECT unique_address

		FROM %s
		WHERE address = $1;`,

		TableUsers,
	)

	resultRow := postgresClient.QueryRow(statementText, address)

	var uniqueAddress string

	err := resultRow.Scan(&uniqueAddress)

	if err == sql.ErrNoRows {
		return ""
	}

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Context = Context

			k.Format(
				"Failed to query the address %#v user's unique address!",
				address,
			)

			k.Payload = err
		})
	}

	return uniqueAddress
}

// InsertFaucetUser, not including the last used field
func InsertFaucetUser(faucetUser FaucetUser) {
	// insert a copy for each token we support
	// TODO this is a hack - would be better to have an enumerable list
	// of supported tokens that isn't hardcoded here
	var tokens []string
	if faucetUser.Network == network.NetworkEthereum {
		tokens = []string{string(faucet.TokenfDAI), string(faucet.TokenfUSDC), string(faucet.TokenfUSDT)}
	} else {
		tokens = []string{string(faucet.TokenfUSDC), string(faucet.TokenfUSDT)}
	}

	for _, tokenName := range tokens {
		postgresClient := postgres.Client()

		statementText := fmt.Sprintf(
			`INSERT INTO %s (
				address,
				unique_address,
				ip_address,
				network,
				token_name
			)

			VALUES (
				$1,
				$2,
				$3,
				$4,
				$5
			);`,

			TableUsers,
		)

		var (
			address       = faucetUser.Address
			uniqueAddress = faucetUser.UniqueAddress
			ipAddress     = faucetUser.IpAddress
			network       = faucetUser.Network
		)

		_, err := postgresClient.Exec(
			statementText,
			address,
			uniqueAddress,
			ipAddress,
			network,
			tokenName,
		)

		if err != nil {
			log.Fatal(func(k *log.Log) {
				k.Context = Context

				k.Format(
					"Failed to insert into the faucet database address %#v, unique address %#v and ip %#v",
					address,
					uniqueAddress,
					ipAddress,
				)

				k.Payload = err
			})
		}
	}
}

func GetFaucetLastUsedAndAddress(uniqueAddress string, network network.BlockchainNetwork, tokenName faucet.FaucetSupportedToken) (*time.Time, string) {
	postgresClient := postgres.Client()

	statementText := fmt.Sprintf(
		`SELECT last_used, address

		FROM %s
		WHERE unique_address = $1
		AND network = $2
		AND token_name = $3;`,

		TableUsers,
	)

	resultRow := postgresClient.QueryRow(
		statementText,
		uniqueAddress,
		network,
		tokenName,
	)

	var (
		lastUsedNullable sql.NullTime
		address          string
	)

	err := resultRow.Scan(&lastUsedNullable, &address)

	if err == sql.ErrNoRows {
		return nil, ""
	}

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Context = Context

			k.Format(
				"Failed to query the unique address %#v, network %#v user's last used and address!",
				uniqueAddress,
				network,
			)

			k.Payload = err
		})
	}

	if !lastUsedNullable.Valid {
		return nil, address
	}

	lastUsed := lastUsedNullable.Time

	return &lastUsed, address
}

// TrackFaucetUse on the address given to be the current time
func TrackFaucetUse(address string, network network.BlockchainNetwork, tokenName faucet.FaucetSupportedToken) {
	postgresClient := postgres.Client()

	statementText := fmt.Sprintf(
		`UPDATE %s
		SET last_used = $1

		WHERE address = $2
		AND network = $3
		AND token_name = $4`,

		TableUsers,
	)

	currentTime := time.Now()

	_, err := postgresClient.Exec(
		statementText,
		currentTime,
		address,
		network,
		tokenName,
	)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Context = Context

			k.Format(
				"Failed to update the faucet users to have the last used for the address %#v!",
				address,
			)

			k.Payload = err
		})
	}
}
