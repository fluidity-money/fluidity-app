// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package main

import (
	"time"

	"github.com/fluidity-money/fluidity-app/common/ethereum/fluidity"
	"github.com/fluidity-money/fluidity-app/lib/databases/timescale/lootboxes"
	"github.com/fluidity-money/fluidity-app/lib/log"
	logs "github.com/fluidity-money/fluidity-app/lib/queues/ethereum"
	"github.com/fluidity-money/fluidity-app/lib/types/ethereum"
	lootboxLib "github.com/fluidity-money/fluidity-app/lib/types/lootboxes"
	"github.com/fluidity-money/fluidity-app/lib/util"
)

const (
	// EnvAddressConfirmerContractAddress for the address of the contract that emits the confirmation event
	EnvAddressConfirmerContractAddress = `FLU_ADDRESS_CONFIRMER_CONTRACT_ADDRESS`

	// LootboxCount for the number of lootboxes to pay out
	LootboxCountCommon    = 180
	LootboxCountUncommon  = 100
	LootboxCountRare      = 17
	LootboxCountUltraRare = 3
)

func main() {
	var (
		addressConfirmerContractAddress_ = util.GetEnvOrFatal(EnvAddressConfirmerContractAddress)
		addressConfirmerContractAddress  = ethereum.AddressFromString(addressConfirmerContractAddress_)
	)

	logs.Logs(func(l logs.Log) {
		programFound, hasBegun, currentEpoch, _ := lootboxes.GetLootboxConfig()

		// if the lootbox isn't enabled, or it isn't running, then we alarm
		// because someone has called the contract to manually reward themselves
		// whem presumably the UI isn't enabled. treated separately for logging
		// reasons.

		switch false {
		case programFound:
			log.Fatal(func(k *log.Log) {
				k.Message = "No lootbox program found, but a log was received for a testnet redemption!"
			})

		case hasBegun:
			log.Fatal(func(k *log.Log) {
				k.Message = "Lootbox program that was found is not running!"
			})
		}

		log.Debugf("Lootbox current epoch running is %v!", currentEpoch)

		if l.Address != addressConfirmerContractAddress {
			log.Debug(func(k *log.Log) {
				k.Format(
					"Event was not emitted by address confirmer contract at %v, was %v - skipping!",
					addressConfirmerContractAddress,
					l.Address,
				)
			})

			return
		}

		// decode all "AddressConfirmed" events
		testnetOwnerPair, err := fluidity.TryDecodeAddressConfirmed(l)

		switch err {
		case fluidity.ErrWrongEvent:
			log.Debug(func(k *log.Log) {
				k.Format(
					"Event for log %v in transaction %v wasn't AddressConfirmed, skipping!",
					l.Index,
					l.TxHash,
				)
			})
			return

		case nil:
			// do nothing

		default:
			log.Fatal(func(k *log.Log) {
				k.Message = "Failed to decode an AddressConfirmed event!"
				k.Payload = err
			})
		}

		// insert as owner if testnet address is valid and not already owned
		didInsert := lootboxes.InsertTestnetOwner(testnetOwnerPair)

		if !didInsert {
			log.Debug(func(k *log.Log) {
				k.Format(
					"Testnet owner pair with owner %v and testnet address %v was not inserted!",
					testnetOwnerPair.Owner,
					testnetOwnerPair.TestnetAddress,
				)
			})

			return
		}

		var (
			currentTime        = time.Now()
			testnetOwnerString = testnetOwnerPair.Owner.String()
		)

		// inserted, pay out lootboxes
		boxes := []lootboxes.Lootbox{
			{
				Address:      testnetOwnerString,
				Source:       lootboxLib.Leaderboard,
				AwardedTime:  currentTime,
				LootboxCount: LootboxCountCommon,
				RewardTier:   1,
			},
			{
				Address:      testnetOwnerString,
				Source:       lootboxLib.Leaderboard,
				AwardedTime:  currentTime,
				LootboxCount: LootboxCountUncommon,
				RewardTier:   2,
			},
			{
				Address:      testnetOwnerString,
				Source:       lootboxLib.Leaderboard,
				AwardedTime:  currentTime,
				LootboxCount: LootboxCountRare,
				RewardTier:   3,
			},
			{
				Address:      testnetOwnerString,
				Source:       lootboxLib.Leaderboard,
				AwardedTime:  currentTime,
				LootboxCount: LootboxCountUltraRare,
				RewardTier:   4,
			},
		}

		for _, lootbox := range boxes {
			lootboxes.InsertLootbox(lootbox, currentEpoch)
		}
	})
}
