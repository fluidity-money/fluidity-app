// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package fluidity

import (
	"fmt"
	"math/big"

	ethCommon "github.com/ethereum/go-ethereum/common"
	"github.com/fluidity-money/fluidity-app/common/ethereum"
	typesEth "github.com/fluidity-money/fluidity-app/lib/types/ethereum"
	"github.com/fluidity-money/fluidity-app/lib/types/misc"
	token_details "github.com/fluidity-money/fluidity-app/lib/types/token-details"
)

type RewardData struct {
	TokenDetails token_details.TokenDetails
	Winner       ethCommon.Address
	Amount       *misc.BigInt
	StartBlock   *misc.BigInt
	EndBlock     *misc.BigInt
}

func DecodeRewardData(log typesEth.Log, token token_details.TokenDetails) (RewardData, error) {
	var rewardData RewardData

	var (
		logData   = log.Data
		logTopics = log.Topics
	)

	decodedData, err := FluidityContractAbi.Unpack("Reward", logData)

	if err != nil {
		return rewardData, fmt.Errorf(
			"failed to unpack reward event data! %v",
			err,
		)
	}

	// topic, address
	if topicsLen := len(logTopics); topicsLen != 2 {
		return rewardData, fmt.Errorf(
			"Unexpected number of log topics! expected %d, got %d!",
			2,
			topicsLen,
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
		TokenDetails: token,
		Winner:       winner,
		Amount:       &amount,
		StartBlock:   &startBlock,
		EndBlock:     &endBlock,
	}

	return rewardData, nil
}

func DecodeLegacyRewardData(log typesEth.Log, token token_details.TokenDetails) (RewardData, error) {
	var (
		logTopics = log.Topics

		winner_ = logTopics[1].String()
		amount_ = logTopics[2]

		winner    = ethCommon.HexToAddress(winner_)
		amountHex = ethereum.ConvertInternalHash(amount_)
		amountBig = amountHex.Big()
		amount    = misc.NewBigIntFromInt(*amountBig)

		blockNumber = log.BlockNumber
		fakeStartBlock = new(misc.BigInt)
		fakeEndBlock = new(misc.BigInt)
	)

	fakeStartBlock.Set(&blockNumber.Int)
	fakeEndBlock.Set(&blockNumber.Int)

	rewardData := RewardData{
		TokenDetails: token,
		Winner:       winner,
		Amount:       &amount,
		StartBlock:   fakeStartBlock,
		EndBlock:     fakeEndBlock,
	}

	return rewardData, nil
}
