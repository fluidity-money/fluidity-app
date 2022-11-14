// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package main

import (
	"github.com/fluidity-money/fluidity-app/lib/databases/timescale/worker"
	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/types/network"
)

func addAndComputeAverageAtx(net network.BlockchainNetwork, blockNumber uint64, tokenShortName string, transfers, limit int) (int, []uint64, []int) {
	log.Debug(func (k *log.Log) {
		k.Message = "About to insert a transaction count into timescale!"
	})

	worker.InsertTransactionCount(
		blockNumber,
		tokenShortName,
		transfers,
		net,
	)

	log.Debug(func (k *log.Log) {
		k.Message = "About to get average atx from timescale!"
	})

	return worker.GetAverageAtx(
		tokenShortName,
		net,
		limit,
	)
}
