// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE file.

package prize_pool

import (
	"database/sql"
	"fmt"
	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/postgres"
	"github.com/fluidity-money/fluidity-app/lib/types/network"
	"github.com/fluidity-money/fluidity-app/lib/types/prize-pool"
)

const (
	// Context to use when logging
	Context = `POSTGRES/PRIZE-POOL`

	// TablePrizePool to read from to get the prize pool size
	TablePrizePool = `prize_pool`
)

type PrizePool = prize_pool.PrizePool

// GetPrizePool, returning nil if a prize pool wasn't found
func GetPrizePool(network network.BlockchainNetwork) (prizePool *PrizePool) {
	postgresClient := postgres.Client()

	statementText := fmt.Sprintf(
		`SELECT
			network,
			amount,
			last_updated

		FROM %s
		WHERE network = $1
		ORDER BY last_updated DESC`,

		TablePrizePool,
	)

	row := postgresClient.QueryRow(statementText, network)

	prizePool = new(PrizePool)

	err := row.Scan(
		&prizePool.Network,
		&prizePool.Amount,
		&prizePool.LastUpdated,
	)

	if err == sql.ErrNoRows {
		return nil
	}

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Context = Context
			k.Message = "Failed to get the prize pool!"
			k.Payload = err
		})
	}

	return prizePool
}

func InsertPrizePool(prizePool PrizePool) {
	postgresClient := postgres.Client()

	statementText := fmt.Sprintf(
		`INSERT INTO %s (
			network,
			amount,
			last_updated
		)

		VALUES (
			$1,
			$2,
			$3
		)`,

		TablePrizePool,
	)

	_, err := postgresClient.Exec(
		statementText,
		prizePool.Network,
		prizePool.Amount,
		prizePool.LastUpdated,
	)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Context = Context
			k.Message = "Failed to insert a prize pool!"
			k.Payload = err
		})
	}

	return
}
