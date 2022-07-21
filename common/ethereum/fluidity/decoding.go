// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package fluidity

import (
	"fmt"
	"math/big"

	ethCommon "github.com/ethereum/go-ethereum/common"
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

	decodedData, err := fluidityContractAbi.Unpack("Reward", logData)

	if err != nil {
		return rewardData, fmt.Errorf(
			"failed to unpack reward event data! %v",
			err,
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
		amount     = misc.NewBigInt(*amountInt)
		startBlock = misc.NewBigInt(*startBlockInt)
		endBlock   = misc.NewBigInt(*endBlockInt)
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
