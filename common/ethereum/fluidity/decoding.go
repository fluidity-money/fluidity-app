// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package fluidity

import (
	"fmt"
	"math/big"
	"time"

	ethCommon "github.com/ethereum/go-ethereum/common"
	ethLogs "github.com/fluidity-money/fluidity-app/lib/queues/ethereum"
	"github.com/fluidity-money/fluidity-app/lib/types/ethereum"
	typesEth "github.com/fluidity-money/fluidity-app/lib/types/ethereum"
	"github.com/fluidity-money/fluidity-app/lib/types/misc"
	token_details "github.com/fluidity-money/fluidity-app/lib/types/token-details"
)

type RewardData struct {
	Blocked      bool
	TokenDetails token_details.TokenDetails
	Winner       ethCommon.Address
	Amount       *misc.BigInt
	StartBlock   *misc.BigInt
	EndBlock     *misc.BigInt
}

type UnblockedRewardData struct {
	RewardData         RewardData
	OriginalRewardHash ethCommon.Hash
}

var ErrWrongEvent = fmt.Errorf("event signature doesn't match")

func TryDecodeRewardData(log typesEth.Log, token token_details.TokenDetails) (RewardData, error) {
	var rewardData RewardData

	var (
		logData   = log.Data
		logTopics = log.Topics
	)

	var (
		eventSignatureString = logTopics[0].String()
		eventSignature = ethCommon.HexToHash(eventSignatureString)

		blocked bool
	)

	switch eventSignature {
	case FluidityContractAbi.Events["Reward"].ID:
		blocked = false

	case FluidityContractAbi.Events["BlockedReward"].ID:
		blocked = true

	default:
		return rewardData, ErrWrongEvent
	}

	// topic, address
	if topicsLen := len(logTopics); topicsLen != 2 {
		return rewardData, fmt.Errorf(
			"Unexpected number of log topics! expected %d, got %d!",
			2,
			topicsLen,
		)
	}

	decodedData, err := FluidityContractAbi.Unpack("Reward", logData)

	if err != nil {
		return rewardData, fmt.Errorf(
			"failed to unpack reward event data! %v",
			err,
		)
	}

	// amount, firstBlock, lastBlock
	if dataLen := len(decodedData); dataLen != 3 {
		return rewardData, fmt.Errorf(
			"Unexpected number of log data! expected %d, got %d!",
			3,
			dataLen,
		)
	}

	var (
		winnerString  = logTopics[1].String()

		amountInt     = decodedData[0].(*big.Int)
		startBlockInt = decodedData[1].(*big.Int)
		endBlockInt   = decodedData[2].(*big.Int)
	)

	var (
		winner     = ethCommon.HexToAddress(winnerString)

		amount     = misc.NewBigIntFromInt(*amountInt)
		startBlock = misc.NewBigIntFromInt(*startBlockInt)
		endBlock   = misc.NewBigIntFromInt(*endBlockInt)
	)

	rewardData = RewardData{
		Blocked:      blocked,
		TokenDetails: token,
		Winner:       winner,
		Amount:       &amount,
		StartBlock:   &startBlock,
		EndBlock:     &endBlock,
	}

	return rewardData, nil
}

func TryDecodeUnblockedRewardData(log typesEth.Log, token token_details.TokenDetails) (UnblockedRewardData, error) {
	var rewardData UnblockedRewardData

	var (
		logData   = log.Data
		logTopics = log.Topics
	)

	var (
		eventSignatureString = logTopics[0].String()
		eventSignature = ethCommon.HexToHash(eventSignatureString)
	)

	if eventSignature != FluidityContractAbi.Events["UnblockReward"].ID {
		return rewardData, ErrWrongEvent
	}

	// topic, original hash, address
	if topicsLen := len(logTopics); topicsLen != 3 {
		return rewardData, fmt.Errorf(
			"Unexpected number of log topics! expected %d, got %d!",
			3,
			topicsLen,
		)
	}

	decodedData, err := FluidityContractAbi.Unpack("UnblockReward", logData)

	if err != nil {
		return rewardData, fmt.Errorf(
			"failed to unpack reward event data! %v",
			err,
		)
	}

	// amount, firstBlock, lastBlock
	if dataLen := len(decodedData); dataLen != 3 {
		return rewardData, fmt.Errorf(
			"Unexpected number of log data! expected %d, got %d!",
			3,
			dataLen,
		)
	}

	var (
		rewardHashString = logTopics[1].String()
		winnerString     = logTopics[2].String()
		amountInt        = decodedData[0].(*big.Int)
		startBlockInt    = decodedData[1].(*big.Int)
		endBlockInt      = decodedData[2].(*big.Int)
	)

	var (
		rewardHash = ethCommon.HexToHash(rewardHashString)
		winner     = ethCommon.HexToAddress(winnerString)
		amount     = misc.NewBigIntFromInt(*amountInt)
		startBlock = misc.NewBigIntFromInt(*startBlockInt)
		endBlock   = misc.NewBigIntFromInt(*endBlockInt)
	)

	rewardData = UnblockedRewardData{
		RewardData: RewardData{
			TokenDetails: token,
			Winner:       winner,
			Amount:       &amount,
			StartBlock:   &startBlock,
			EndBlock:     &endBlock,
		},
		OriginalRewardHash: rewardHash,
	}

	return rewardData, nil
}

func TryDecodeStakingEventData(l ethLogs.Log) (ethereum.StakingEvent, error) {
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
    case StakingAbi.Events["Staked"].ID:

        decodedData, err := StakingAbi.Unpack("Staked", logData)

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
			return stakingEvent, fmt.Errorf(
				"Decoded a timestamp that was larger than int64! %v", 
				lockedTimestampInt.String(),
			)
        }

        lockedTimestampInt64 := lockedTimestampInt.Int64()
        lockedTimestamp := time.Unix(lockedTimestampInt64, 0)

        stakingEvent.Address = ethereum.AddressFromString(addressString)
        stakingEvent.InsertedDate = lockedTimestamp
        stakingEvent.UsdAmount = misc.NewBigIntFromInt(*usdAmountInt)
        stakingEvent.LockupLength = int(lockupLengthInt.Int64())

        return stakingEvent, nil
    default:
        return stakingEvent, ErrWrongEvent
    }
}
