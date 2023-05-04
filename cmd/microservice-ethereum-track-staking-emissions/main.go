// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package main

import (
	"github.com/fluidity-money/fluidity-app/common/ethereum/fluidity"
	"github.com/fluidity-money/fluidity-app/lib/databases/timescale/airdrop"
	"github.com/fluidity-money/fluidity-app/lib/log"
	ethLogs "github.com/fluidity-money/fluidity-app/lib/queues/ethereum"
)

func main() {
	ethLogs.Logs(func(l ethLogs.Log) {
		stakingEvent, err := fluidity.TryDecodeStakingEventData(l)

		switch err {
		case fluidity.ErrWrongEvent:
			log.Debug(func(k *log.Log) {
				k.Format(
					"Event for log %v of transaction %v was not a staking event!",
					l.Index,
					l.TxHash,
				)
			})
			return

		case nil:
			airdrop.InsertStakingEvent(stakingEvent)

		default:
			log.Fatal(func(k *log.Log) {
				k.Message = "Failed to classify a staking event!"
				k.Payload = err
			})
		}
	})
}
