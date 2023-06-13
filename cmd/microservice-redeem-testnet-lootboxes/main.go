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
    LootboxCount = 0
)

func main() {
    var (
        addressConfirmerContractAddress_ = util.GetEnvOrFatal(EnvAddressConfirmerContractAddress)
        addressConfirmerContractAddress  = ethereum.AddressFromString(addressConfirmerContractAddress_)
    )


    logs.Logs(func(l logs.Log) {
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

        // inserted, pay out lootboxes
        lootbox := lootboxes.Lootbox{
            Address: testnetOwnerPair.Owner.String(),
            Source: lootboxLib.Leaderboard,
            AwardedTime: time.Now(),
            LootboxCount: LootboxCount,
        }
        lootboxes.InsertLootbox(lootbox)
    })
}
