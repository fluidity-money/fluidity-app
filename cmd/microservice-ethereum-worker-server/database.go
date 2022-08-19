package main

import (
	"github.com/fluidity-money/fluidity-app/lib/databases/timescale/worker"
	"github.com/fluidity-money/fluidity-app/lib/types/network"
)

func addAndComputeAverageAtx(blockNumber, atxBufferSize uint64, tokenShortName string, transfers int) int {

	worker.InsertTransactionCount(
		blockNumber,
		tokenShortName,
		transfers,
		network.NetworkEthereum,
	)

	var blockNumber_ uint64 = 0

	if blockNumber > atxBufferSize {
		blockNumber_ = blockNumber - atxBufferSize
	}

	averageAtx := worker.GetAverageAtx(
		blockNumber_,
		tokenShortName,
		network.NetworkEthereum,
	)

	return averageAtx
}
