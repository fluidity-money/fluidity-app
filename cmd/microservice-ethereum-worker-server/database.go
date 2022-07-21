// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE file.

package main

import (
	"github.com/fluidity-money/fluidity-app/lib/databases/timescale/worker"
	"github.com/fluidity-money/fluidity-app/lib/types/network"
)

func addAndComputeAverageAtx(blockNumber uint64, tokenShortName string, transfers int) int {

	worker.InsertTransactionCount(
		blockNumber,
		tokenShortName,
		transfers,
		network.NetworkEthereum,
	)

	var blockNumber_ uint64 = 0

	if blockNumber > AtxBufferSize {
		blockNumber_ = blockNumber - AtxBufferSize
	}

	averageAtx := worker.GetAverageAtx(
		blockNumber_,
		tokenShortName,
		network.NetworkEthereum,
	)

	return averageAtx
}
