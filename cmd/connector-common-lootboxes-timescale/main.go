package main

import (
	"github.com/fluidity-money/fluidity-app/lib/databases/timescale/lootboxes"
	"github.com/fluidity-money/fluidity-app/lib/databases/timescale/user-actions"
	queue "github.com/fluidity-money/fluidity-app/lib/queues/lootboxes"
)

func main() {
	queue.LootboxesAll(func(lootbox lootboxes.Lootbox) {
		if lootbox.TransactionHash != "" {
			user_actions.UpdateAggregatedUserTransactionByHashWithLootbottles(
				lootbox.LootboxCount,
				lootbox.RewardTier,
				lootbox.TransactionHash,
			)
		}

		lootboxes.InsertLootbox(lootbox)
	})
}
