// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package ethereum

// transactions contains transactions that we've seen. The definition of
// transactions mirror the types in queues.

import (
	"fmt"
	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/postgres"
	"github.com/fluidity-money/fluidity-app/lib/types/ethereum"
)

type Transaction = ethereum.Transaction

func InsertTransactions(transactions ...Transaction) {
	databaseClient := postgres.Client()

	statementText := fmt.Sprintf(
		`INSERT INTO %s (
			block_hash,
			chain_id,
			cost,
			data,
			gas,
			gas_fee_cap,
			gas_price,
			hash,
			nonce,
			to_,
			from_,
			type,
			value
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
			$11,
			$12,
			$13
		);`,

		TableTransactions,
	)

	for transactionNumber, transaction := range transactions {
		_, err := databaseClient.Exec(
			statementText,
			transaction.BlockHash,
			transaction.ChainId,
			transaction.Cost,
			transaction.Data,
			transaction.Gas,
			transaction.GasFeeCap,
			transaction.GasPrice,
			transaction.Hash,
			transaction.Nonce,
			transaction.To,
			transaction.From,
			transaction.Type,
			transaction.Value,
		)

		if err != nil {
			log.Fatal(func(k *log.Log) {
				k.Context = Context

				k.Format(
					"Failed to insert transaction number %v!",
					transactionNumber,
				)

				k.Payload = err
			})
		}
	}
}
