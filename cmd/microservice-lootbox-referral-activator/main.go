// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package main

import (
	"math"
	"strconv"

	"github.com/fluidity-money/fluidity-app/lib/databases/timescale/referrals"
	"github.com/fluidity-money/fluidity-app/lib/log"
	lootboxes_queue "github.com/fluidity-money/fluidity-app/lib/queues/lootboxes"
	"github.com/fluidity-money/fluidity-app/lib/types/ethereum"
	"github.com/fluidity-money/fluidity-app/lib/types/lootboxes"
	"github.com/fluidity-money/fluidity-app/lib/util"
)

const (
	// EnvLootboxReferralAmount to activate a referral
	EnvLootboxReferralAmount = `FLU_LOOTBOX_REFERRAL_AMOUNT`
)

func main() {
	var (
		lootboxReferralAmount_ = util.GetEnvOrFatal(EnvLootboxReferralAmount)
	)

	lootboxReferralAmount, err := strconv.ParseUint(lootboxReferralAmount_, 10, 64)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Message = "Failed to parse FLU_LOOTBOX_REFERRAL_AMOUNT from an env!"
			k.Payload = err
		})
	}

	lootboxes_queue.LootboxesAll(func(lootbox lootboxes_queue.Lootbox) {
		var (
			source          = lootbox.Source
			transactionHash = lootbox.TransactionHash
			address         = lootbox.Address
			lootboxCount    = lootbox.LootboxCount
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

		// number of referrals to update
		maxUnclaimedReferrals := math.Floor(lootboxCount/float64(lootboxReferralAmount)) + 2

		unclaimedReferrals := referrals.GetLatestUnclaimedReferrals(
			ethereum.AddressFromString(address),
			int(maxUnclaimedReferrals),
		)

		for _, referral := range unclaimedReferrals {
			if lootboxCount <= 0 {
				break
			}

			remReferralActivation := float64(lootboxReferralAmount) - referral.Progress

			maxReferralContribution := math.Min(lootboxCount, remReferralActivation)

			lootboxCount -= maxReferralContribution

			referral.Progress += maxReferralContribution

			if referral.Progress >= float64(lootboxReferralAmount) {
				referral.Active = true
			}

			go referrals.UpdateReferral(referral)
		}
	})
}
