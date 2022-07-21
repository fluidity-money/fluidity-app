// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE file.

package queue

import (
	"github.com/fluidity-money/fluidity-app/lib/queue"
	"github.com/fluidity-money/fluidity-app/lib/queues/solana"
)

func SendConfirmedBlocks(slots []uint64) {
	for _, slot := range slots {
		slotContainer := solana.Slot{
			Slot: slot,
		}

		queue.SendMessage(solana.TopicSlots, slotContainer)
	}
}
