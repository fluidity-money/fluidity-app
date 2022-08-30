// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package ethereum

// transactions contains transactions that we've seen. The definition of
// transactions mirror the types in queues.

import (
	"fmt"
	logging "github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/postgres"
	"github.com/fluidity-money/fluidity-app/lib/types/ethereum"
)

type Log = ethereum.Log

// InsertLog inserts a log into the database then populates topic tables
// so that you can find this log easily by querying them
func InsertLog(log Log) {
	databaseClient := postgres.Client()

	logsStatementText := fmt.Sprintf(
		`INSERT INTO %s (
			address,
			data,
			block_number,
			transaction_hash,
			transaction_index,
			block_hash,
			index,
			topic_1,
			topic_2,
			topic_3,
			topic_4
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
			$9,
			$10,
			$11
		);`,

		TableLogs,
	)

	var topic1, topic2, topic3, topic4 ethereum.Hash

	for i, value := range log.Topics {
		switch i {
		case 0:
			topic1 = value

		case 1:
			topic2 = value

		case 2:
			topic3 = value

		case 3:
			topic4 = value
		}
	}

	_, err := databaseClient.Exec(
		logsStatementText,
		log.Address,
		log.Data,
		log.BlockNumber,
		log.TxHash,
		log.TxIndex,
		log.BlockHash,
		log.Index,
		topic1,
		topic2,
		topic3,
		topic4,
	)

	if err != nil {
		logging.Fatal(func(k *logging.Log) {
			k.Context = Context
			k.Message = "Failed to insert a transaction log!"
			k.Payload = err
		})
	}
}
