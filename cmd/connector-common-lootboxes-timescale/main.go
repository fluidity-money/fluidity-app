package main

import (
	"github.com/fluidity-money/fluidity-app/lib/databases/timescale/lootboxes"
	"github.com/fluidity-money/fluidity-app/lib/databases/timescale/user-actions"
	"github.com/fluidity-money/fluidity-app/lib/log"
	queue "github.com/fluidity-money/fluidity-app/lib/queues/lootboxes"
)

func main() {
	queue.LootboxesAll(func(lootbox lootboxes.Lootbox) {
		if lootbox.TransactionHash == "" {
			log.App(func(k *log.Log) {
				k.Message = "Got a lootbox with an empty transaction hash! Ignoring associating it."
			})

			return
		}

		user_actions.UpdateAggregatedUserTransactionByHashWithLootbottles(
			lootbox.LootboxCount,
			lootbox.RewardTier,
			lootbox.TransactionHash,
		)

		lootboxes.InsertLootbox(lootbox)
	})
}
