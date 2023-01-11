// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package worker

import (
	"fmt"

	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/postgres"
)

// GetWorkerConfigSolana, assuming there's only one, for the network given
func GetWorkerConfigSolana() (config WorkerConfigSolana) {
	postgresClient := postgres.Client()

	statementText := fmt.Sprintf(`
		SELECT
			solana_block_time,
			transfer_compute,
			atx_buffer_size
		FROM %s`,

		TableWorkerConfigSolana,
	)

	row := postgresClient.QueryRow(statementText)

	if err := row.Err(); err != nil {
		log.Fatal(func(k *log.Log) {
			k.Context = Context
			k.Message = "Failed to get the Solana worker config!"
			k.Payload = err
		})
	}

	err := row.Scan(
		&config.SolanaBlockTime,
		&config.TransferCompute,
		&config.AtxBufferSize,
	)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Context = Context
			k.Message = "Failed to decode Solana worker config!"
			k.Payload = err
		})
	}

	return config
}
