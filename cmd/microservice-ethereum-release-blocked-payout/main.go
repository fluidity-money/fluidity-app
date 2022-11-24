// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package main

import (
	"encoding/json"
	"fmt"

	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/common/hexutil"
	"github.com/fluidity-money/fluidity-app/common/ethereum/fluidity"
	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/types/winners"
	"github.com/fluidity-money/fluidity-app/lib/util"
)

const (
    // EnvBlockedPayoutPayload to read the payload sent in discord from
    EnvBlockedPayoutPayload = `FLU_ETHEREUM_BLOCKED_PAYOUT_PAYLOAD`

    // EnvShouldPayout to be set to `true` to release the payout,
    // `false` to just acknowledge it
    EnvShouldPayout = `FLU_ETHEREUM_PAYOUT`
)

func main() {
    var (
        payload    = util.GetEnvOrFatal(EnvBlockedPayoutPayload)
        payout_    = util.GetEnvOrFatal(EnvShouldPayout)

        payout     bool
    )

    switch payout_ {
        case "true":
            payout = true
        case "false":
            payout = false
        default:
            log.Fatal(func (k *log.Log) {
                k.Format(
                    "Invalid value for %s %s - expected true or false!",
                    EnvBlockedPayoutPayload,
                    payout_,
                )
            })
    }

    var blockedReward winners.Winner

    err := json.Unmarshal([]byte(payload), &blockedReward)

    if err != nil {
        log.Fatal(func (k *log.Log) {
            k.Message = "Failed to read a blocked reward payload from env!"
            k.Payload = err
        })
    }

    var (
        user_       = blockedReward.WinnerAddress
        amount_     = blockedReward.WinningAmount
        firstBlock_ = blockedReward.BatchFirstBlock
        lastBlock_  = blockedReward.BatchLastBlock

        amount     = &amount_.Int
        firstBlock = &firstBlock_.Int
        lastBlock  = &lastBlock_.Int
    )
    user := common.HexToAddress(user_)

    unblockCall, err := fluidity.FluidityContractAbi.Pack(
        "unblockReward",
        user,
        amount,
        payout,
        firstBlock,
        lastBlock,
    )

    if err != nil {
        log.Fatal(func (k *log.Log) {
            k.Message = "Failed to encode an unblockReward call!"
            k.Payload = err
        })
    }

	fmt.Println(hexutil.Encode(unblockCall))
}
