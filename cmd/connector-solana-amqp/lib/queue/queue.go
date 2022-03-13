package queue

import (
    "github.com/fluidity-money/fluidity-app/lib/queues/solana"
    "github.com/fluidity-money/fluidity-app/lib/queue"
)

func SendConfirmedBlocks(slots []uint64) {
    for _, slot := range slots {
        slotContainer := solana.Slot {
            Slot: slot,
        }

        queue.SendMessage(solana.TopicSlots, slotContainer)
    }
}
