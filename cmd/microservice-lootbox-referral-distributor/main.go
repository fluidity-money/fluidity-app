// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package main

import (
	"github.com/fluidity-money/fluidity-app/lib/databases/timescale/referrals"
	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/queue"
	lootboxes_queue "github.com/fluidity-money/fluidity-app/lib/queues/lootboxes"
	"github.com/fluidity-money/fluidity-app/lib/types/ethereum"
	"github.com/fluidity-money/fluidity-app/lib/types/lootboxes"
	"github.com/fluidity-money/fluidity-app/lib/types/misc"
)

func main() {
	lootboxes_queue.LootboxesAll(func(lootbox lootboxes_queue.Lootbox) {
		var (
			source          = lootbox.Source
			transactionHash = lootbox.TransactionHash
			address         = lootbox.Address
			lootboxCount    = lootbox.LootboxCount
			awardedTime     = lootbox.AwardedTime
		)

		// don't track non-transaction lootboxes
		if source != lootboxes.Transaction {
			log.Debug(func(k *log.Log) {
				k.Format(
					"Lootbox was not derived from transaction - SKIPPING!",
				)
			})
		}

		// log error if event is missing transactionHash or address
		if address == "" || transactionHash == "" {
			log.Fatal(func(k *log.Log) {
				k.Format(
					"Received Transaction Lootbox with missing address/transaction",
				)
			})
		}

		// hardcode referrers to get 10% of referee lootboxes
		referralLootboxCount := lootboxCount / 10

		activeReferrals := referrals.GetClaimedReferrals(
			ethereum.AddressFromString(address),
		)

		for _, referral := range activeReferrals {
			referralLootbox := lootboxes.Lootbox{
				// Send lootbox to referrer
				Address:         referral.Referrer,
				Source:          lootboxes.Referral,
				TransactionHash: "",
				AwardedTime:     awardedTime,
				Volume:          misc.BigIntFromUint64(0),
				RewardTier:      0,
				LootboxCount:    referralLootboxCount,
			}

			go queue.SendMessage(lootboxes_queue.TopicLootboxes, referralLootbox)
		}
	})
}
