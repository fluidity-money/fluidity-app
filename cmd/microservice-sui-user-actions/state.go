package main

import (
	"context"
	"encoding/json"

	"github.com/fluidity-money/sui-go-sdk/models"
	"github.com/fluidity-money/sui-go-sdk/sui"

	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/state"
	"github.com/fluidity-money/fluidity-app/lib/types/misc"
)

// getTransactionBlocks to get all blocks from a list of digests, batching requests if there are more than the RPC's limit
func getTransactionBlocks(client sui.ISuiAPI, digests []string) (models.SuiMultiGetTransactionBlocksResponse, error) {
	const BatchLimit = 50

	var (
		transactionBlocks models.SuiMultiGetTransactionBlocksResponse

		options = models.SuiTransactionBlockOptions{
			ShowInput:         true,
			ShowEvents:        true,
			ShowObjectChanges: true,
			ShowEffects:       true,
		}
	)

	if len(digests) <= BatchLimit {
		return client.SuiMultiGetTransactionBlocks(context.Background(), models.SuiMultiGetTransactionBlocksRequest{
			Digests: digests,
			Options: options,
		})
	}

	for len(digests) > BatchLimit {
		r, err := client.SuiMultiGetTransactionBlocks(context.Background(), models.SuiMultiGetTransactionBlocksRequest{
			Digests: digests[:BatchLimit],
			Options: options,
		})

		if err != nil {
			return transactionBlocks, err
		}

		transactionBlocks = append(transactionBlocks, r...)

		digests = digests[BatchLimit:]
	}

	return transactionBlocks, nil
}

func getLastWinningCheckpoint(key string) misc.BigInt {
	bytes := state.Get(key)

	if len(bytes) == 0 {
		// not found
		return misc.BigIntFromInt64(0)
	}

	var res misc.BigInt

	err := json.Unmarshal(bytes, &res)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Message = "Failed to get the last seen winning checkpoint from redis!"
			k.Payload = err
		})
	}

	return res
}

func writeLastWinningCheckpoint(key string, checkpoint misc.BigInt) {
	state.Set(key, checkpoint)
}
