// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package worker

import (
	"fmt"

	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/timescale"
	"github.com/fluidity-money/fluidity-app/lib/types/network"
	"github.com/fluidity-money/fluidity-app/lib/types/worker"
)

const (
	// Context to use for logging
	Context = "TIMESCALE/WORKER"

	// TableAverageAtx to use to get the average ATX from
	TableAverageAtx = "worker_buffered_atx"

	// TableEmissions to record emissions from workers
	TableEmissions = "worker_emissions"
)

type Emission = worker.Emission

// GetLastBlocksTransactionCount, returning the average
// and sum of the transactions
func GetLastBlocksTransactionCount(tokenShortName string, network network.BlockchainNetwork, limit int) (average int, sum int, blocks []uint64, transactionCounts []int) {

	timescaleClient := timescale.Client() //

	statementText := fmt.Sprintf(
		`SELECT block_number, transaction_count
		FROM %s
		WHERE token_short_name = $1
		AND network = $2
		ORDER BY block_number DESC
		LIMIT $3`,

		TableAverageAtx,
	)

	log.Debugf(
		"token short name: %#v, network: %#v, limit: %#v",
		tokenShortName,
		network,
		limit,
	)

	rows, err := timescaleClient.Query(
		statementText,
		tokenShortName,
		network,
		limit,
	)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Context = Context
			k.Message = "Failed to query the average atx field for calculation!"
			k.Payload = err
		})
	}

	defer rows.Close()

	sum = 0

	blocks = make([]uint64, 0)

	transactionCounts = make([]int, 0)

	for rows.Next() {
		var (
			blockNumber      uint64
			transactionCount int
		)

		err := rows.Scan(&blockNumber, &transactionCount)

		if err != nil {
			log.Fatal(func(k *log.Log) {
				k.Context = Context
				k.Message = "Failed to scan the transaction count to an int!"
				k.Payload = err
			})
		}

		blocks = append(blocks, blockNumber)

		transactionCounts = append(transactionCounts, transactionCount)

		sum += transactionCount
	}

	average = sum / limit

	return average, sum, blocks, transactionCounts
}

// InsertTransactionCount for a block number for the number of transactions
// in a block
func InsertTransactionCount(blockNumber uint64, tokenShortName string, transactionCount int, network network.BlockchainNetwork) {

	timescaleClient := timescale.Client()

	statementText := fmt.Sprintf(
		`INSERT INTO %s (
			block_number,
			token_short_name,
			transaction_count,
			network
		)

		VALUES (
			$1,
			$2,
			$3,
			$4
		);`,

		TableAverageAtx,
	)

	_, err := timescaleClient.Exec(
		statementText,
		blockNumber,
		tokenShortName,
		transactionCount,
		network,
	)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Context = Context

			k.Format(
				"Failed to insert transaction count %v for block number %v!",
				transactionCount,
				blockNumber,
			)

			k.Payload = err
		})
	}
}
