package ethereum

// transactions contains transactions that we've seen. The definition of
// transactions mirror the types in queues.

import (
	"fmt"
	"github.com/fluidity-money/fluidity-app/lib/postgres"
	"github.com/fluidity-money/fluidity-app/lib/log"
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

	statement, err := databaseClient.Prepare(statementText)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Context = Context
			k.Message = "Failed to prepare a statement!"
			k.Payload = err
		})
	}

	defer statement.Close()

	for transactionNumber, transaction := range transactions {
		_, err := statement.Exec(
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
