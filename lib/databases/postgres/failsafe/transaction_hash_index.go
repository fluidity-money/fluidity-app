// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package failsafe

import (
	"fmt"

	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/postgres"
	"github.com/fluidity-money/fluidity-app/lib/types/ethereum"
	"github.com/fluidity-money/fluidity-app/lib/types/misc"
	"github.com/fluidity-money/fluidity-app/lib/util"
)

// CommitTransactionHashIndex using the transactionHash given, the
// logIndex, and the worker ID, forming a composite primary key
// that guarantees uniqueness. Will Fatal if the insertion fails, with a
// reason. Useful for identifying duplication-related issues.
func CommitTransactionHashIndex(transactionHash ethereum.Hash, logIndex misc.BigInt) {
	postgresClient := postgres.Client()

	statementText := fmt.Sprintf(`
		INSERT INTO %v (
			transaction_hash,
			log_index,
			worker_id
		)
		VALUES (
			$1,
			$2,
			$3
		)`,

		TableFailsafeTransactionHashIndex,
	)

	workerId := util.GetWorkerId()

	_, err := postgresClient.Exec(statementText, transactionHash, logIndex, workerId)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Context = Context

			k.Format(
				"Failed to acquire a failsafe for transaction hash %v, log index %v, worker id %v",
				transactionHash,
				logIndex,
				workerId,
			)

			k.Payload = err
		})
	}
}
