package lootboxes

import (
	"fmt"
	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/timescale"
	types "github.com/fluidity-money/fluidity-app/lib/types/lootboxes"
)

const (
	// Context to use for logging
	Context = `TIMESCALE/LOOTBOXES`

	// TableLootboxes to use when inserting
	// derived lootboxes to database
	TableLootboxes = `lootbox`
)

type Lootbox = types.Lootbox

// InsertTransactionAttributes to store the attributes of a winning transaction
func InsertLootbox(lootbox Lootbox) {
	timescaleClient := timescale.Client()

	statementText := fmt.Sprintf(
		`INSERT INTO %s (
			address,
			source,
			transaction_hash,
			awarded_time,
			volume,
			reward_tier,
			lootbox_count
		)

		VALUES (
			$1,
			$2,
			$3,
			$4,
			$5,
			$6,
			$7
		)`,

		TableLootboxes,
	)

	_, err := timescaleClient.Exec(
		statementText,
		lootbox.Address,
		lootbox.Source,
		lootbox.TransactionHash,
		lootbox.AwardedTime,
		lootbox.Volume,
		lootbox.RewardTier,
		lootbox.LootboxCount,
	)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Context = Context
			k.Message = "Failed to insert transaction attributes!"
			k.Payload = err
		})
	}
}
