// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package main

import (
    "fmt"
    "math/big"
    "time"

    ethCommon "github.com/ethereum/go-ethereum/common"
    "github.com/fluidity-money/fluidity-app/common/ethereum/fluidity"
    "github.com/fluidity-money/fluidity-app/lib/databases/timescale/airdrop"
    "github.com/fluidity-money/fluidity-app/lib/log"
    ethLogs "github.com/fluidity-money/fluidity-app/lib/queues/ethereum"
    "github.com/fluidity-money/fluidity-app/lib/types/ethereum"
    "github.com/fluidity-money/fluidity-app/lib/types/misc"
)

func classifyStakingEvent(l ethLogs.Log) (ethereum.StakingEvent, error) {
    var (
        logTopics = l.Topics
        logData   = l.Data
        stakingEvent ethereum.StakingEvent
    )

    var (
        eventSignatureString = logTopics[0].String()
        eventSignature       = ethCommon.HexToHash(eventSignatureString)
    )

    switch eventSignature {
    case fluidity.StakingAbi.Events["Staked"].ID:

        decodedData, err := fluidity.StakingAbi.Unpack("Staked", logData)

        if err != nil {
            return stakingEvent, fmt.Errorf(
                "failed to unpack Staked event data! %v",
                err,
            )
        }

        // lockupLength, lockedTimestamp, fusdcAmount, usdAmount, wethAmount
        if dataLen := len(decodedData); dataLen != 5 {
            return stakingEvent, fmt.Errorf(
                "Unexpected number of log data! expected %d, got %d!",
                5,
                dataLen,
            )
        }

        // event, sender address
        if topicsLen := len(logTopics); topicsLen != 2 {
            return stakingEvent, fmt.Errorf(
                "Unexpected number of log topics! expected %d, got %d!",
                2,
                topicsLen,
            )
        }

        var (
            addressString      = logTopics[1].String()
            lockupLengthInt    = decodedData[0].(*big.Int)
            lockedTimestampInt = decodedData[1].(*big.Int)
            usdAmountInt       = decodedData[3].(*big.Int)
        )

        if !lockedTimestampInt.IsInt64() {
            log.Fatal(func(k *log.Log) {
                k.Message = "Decoded a timestamp that was larger than int64!" 
                k.Payload = lockedTimestampInt.String()
            })
        }

        lockedTimestampInt64 := lockedTimestampInt.Int64()
        lockedTimestamp := time.Unix(lockedTimestampInt64, 0)

        stakingEvent.Address = ethereum.AddressFromString(addressString)
        stakingEvent.InsertedDate = lockedTimestamp
        stakingEvent.UsdAmount = misc.NewBigIntFromInt(*usdAmountInt)
        stakingEvent.LockupLength = int(lockupLengthInt.Int64())

        return stakingEvent, nil
    default:
        return stakingEvent, fluidity.ErrWrongEvent
    }
}

func main() {
    ethLogs.Logs(func(l ethLogs.Log) {
        stakingEvent, err := classifyStakingEvent(l)

        if err != nil {
            log.Debug(func(k *log.Log) {
                k.Format(
                    "Event for log %d of transaction %x was not a staking event!",
                    l.Index,
                    l.TxHash,
                )
            })
            return
        }
        
        airdrop.InsertStakingEvent(stakingEvent)
    })
}
