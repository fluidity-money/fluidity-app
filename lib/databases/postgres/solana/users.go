// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package solana

import (
	"database/sql"
	"fmt"
	"math/big"

	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/postgres"
)

type MintLimit struct {
	TokenName string
	TokenDecimals int
	MintLimit *big.Int
}

// GetUserMintLimit for the per-user limit for the given token
func GetUserMintLimit(tokenName string) MintLimit {
	databaseClient := postgres.Client()

	statementText := fmt.Sprintf(
		`SELECT 
			token_short_name,
			token_decimals,
			mint_limit
		FROM %s
		WHERE token_short_name = $1`,

		TableMintLimits,
	)

	row := databaseClient.QueryRow(statementText, tokenName)

	if err := row.Err(); err != nil {
		log.Fatal(func(k *log.Log) {
			k.Context = Context

			k.Format(
				"Failed to query the Solana token (%#v) mint limit!",
				tokenName,
			)

			k.Payload = err
		})
	}

	var limit MintLimit

	err := row.Scan(
		&limit.TokenName,
		&limit.TokenDecimals,
		&limit.MintLimit,
	)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Context = Context

			k.Format(
				"Failed to scan the mint limit for a token (%#v)",
				tokenName,
			)

			k.Payload = err
		})
	}

	return limit 
}

// GetUserAmountMinted for the amount the given address has minted so far
func GetUserAmountMinted(address string) float64 {
	databaseClient := postgres.Client()

	statementText := fmt.Sprintf(
		`SELECT amount_minted
		FROM %s
		WHERE address = $1`,

		TableUsers,
	)

	row := databaseClient.QueryRow(statementText, address)

	if err := row.Err(); err != nil {
		log.Fatal(func(k *log.Log) {
			k.Context = Context

			k.Format(
				"Failed to query the Solana user (%#v) mint limit!",
				address,
			)

			k.Payload = err
		})
	}

	var amount float64

	err := row.Scan(&amount)

	if err == sql.ErrNoRows {
		return 0
	}

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Context = Context

			k.Format(
				"Failed to scan the mint amount for a user address (%#v)",
				address,
			)

			k.Payload = err
		})
	}

	return amount
}

func ReduceMintUserLimit(address string, amount float64) {
	databaseClient := postgres.Client()

	statementText := fmt.Sprintf(
		`INSERT INTO %s (
			address,
			amount_minted,
			last_updated
		)

		VALUES (
			$1,
			0,
			NOW()
		)

		ON CONFLICT (address)
		DO UPDATE SET amount_minted = solana_users.amount_minted - $2;`,

		TableUsers,
	)

	_, err := databaseClient.Exec(
		statementText,
		address,
		amount,
	)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Context = Context

			k.Format(
				"Failed to reduce the Solana user (%#v) mint limit by %v!",
				address,
				amount,
			)

			k.Payload = err
		})
	}
}

func AddMintUserLimit(address string, amount float64) {
	databaseClient := postgres.Client()

	statementText := fmt.Sprintf(
		`INSERT INTO %s (
			address,
			amount_minted,
			last_updated
		)

		VALUES (
			$1,
			$2,
			NOW()
		)

		ON CONFLICT (address)
		DO UPDATE SET amount_minted = solana_users.amount_minted + $2;`,

		TableUsers,
	)

	_, err := databaseClient.Exec(
		statementText,
		address,
		amount,
	)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Context = Context

			k.Format(
				"Failed to add the Solana user (%#v) mint limit by %v!",
				address,
				amount,
			)

			k.Payload = err
		})
	}
}
