package main

import (
	"github.com/fluidity-money/fluidity-app/lib/databases/timescale/worker"
	"github.com/fluidity-money/fluidity-app/lib/types/network"
)

func addAndComputeAverageAtx(blockNumber uint64, tokenShortName string, transfers int) int {
	worker.InsertTransactionCount(blockNumber, tokenShortName, transfers, network.NetworkEthereum)
	return worker.GetAverageAtx(blockNumber - AtxBufferSize, tokenShortName, network.NetworkEthereum)
}
