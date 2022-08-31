// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package main

import (
	"github.com/fluidity-money/fluidity-app/lib/databases/timescale/worker"
	"github.com/fluidity-money/fluidity-app/lib/types/network"
)

func addAndComputeAverageAtx(blockNumber uint64, tokenShortName string, transfers, limit int) (int, []uint64, []int) {

	worker.InsertTransactionCount(
		blockNumber,
		tokenShortName,
		transfers,
		network.NetworkEthereum,
	)

	return worker.GetAverageAtx(
		tokenShortName,
		network.NetworkEthereum,
		limit,
	)
}
