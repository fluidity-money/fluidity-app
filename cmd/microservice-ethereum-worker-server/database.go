// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package main

import (
	"github.com/fluidity-money/fluidity-app/lib/databases/timescale/worker"
	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/types/network"
)

func addBtx(network_ network.BlockchainNetwork, blockNumber uint64, tokenShortName string, transfers int) {
	log.Debug(func (k *log.Log) {
		k.Message = "About to insert a transaction count into timescale!"
	})

	worker.InsertTransactionCount(
		blockNumber,
		tokenShortName,
		transfers,
		network_,
	)
}

func computeTransactionsSumAndAverage(network_ network.BlockchainNetwork, tokenShortName string, limit int) (int, int, []uint64, []int) {
	log.Debug(func (k *log.Log) {
		k.Message = "About to get average atx from timescale!"
	})

	return worker.GetLastBlocksTransactionCount(
		tokenShortName,
		network_,
		limit,
	)
}
