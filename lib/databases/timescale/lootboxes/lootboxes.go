package lootboxes

import (
	"fmt"

	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/timescale"
	"github.com/fluidity-money/fluidity-app/lib/types/ethereum"
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

// InsertLootbox inserts a Lootbox into the database
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

// GetLootboxes gets all Lootboxes earned by address, limited by a number
func GetLootboxes(address ethereum.Address, limit int) []Lootbox {
	timescaleClient := timescale.Client()

	statementText := fmt.Sprintf(
		`SELECT
			address,
			source,
			transaction_hash,
			awarded_time,
			volume,
			reward_tier,
			lootbox_count

		FROM %s 
		WHERE address = $1
		LIMIT $2
		`,

		TableLootboxes,
	)

	rows, err := timescaleClient.Query(
		statementText,
		address,
		limit,
	)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Context = Context

			k.Format(
				"Failed to get the lootboxes with a count of %v!",
				limit,
			)

			k.Payload = err
		})
	}

	defer rows.Close()

	lootboxes := make([]Lootbox, 0)

	for rows.Next() {
		var (
			lootbox Lootbox
		)

		err := rows.Scan(
			&lootbox.Address,
			&lootbox.Source,
			&lootbox.TransactionHash,
			&lootbox.AwardedTime,
			&lootbox.Volume,
			&lootbox.RewardTier,
			&lootbox.LootboxCount,
		)

		if err != nil {
			log.Fatal(func(k *log.Log) {
				k.Context = Context
				k.Message = "Failed to scan a row of the lootboxes!"
				k.Payload = err
			})
		}

		lootboxes = append(lootboxes, lootbox)
	}

	return lootboxes
}
