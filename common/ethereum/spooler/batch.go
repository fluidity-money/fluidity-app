// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package spooler

import (
	"fmt"
	"math/big"

	"github.com/fluidity-money/fluidity-app/lib/types/applications"
	"github.com/fluidity-money/fluidity-app/lib/types/ethereum"
	"github.com/fluidity-money/fluidity-app/lib/types/misc"
	"github.com/fluidity-money/fluidity-app/lib/types/worker"
)

// BatchWinningsByUser batches winnings that have the same token, returning
// the total winnings each user has earned
func BatchWinnings(winnings []worker.EthereumReward, expectedCategory string) (misc.BigInt, misc.BigInt, map[applications.UtilityName]map[ethereum.Address]misc.BigInt, error) {

	// utility => address => winnings
	rewards := make(map[applications.UtilityName]map[ethereum.Address]misc.BigInt)

	var (
		firstRewardBlock = winnings[0].BlockNumber

		firstBlockInt = new(big.Int).Set(&firstRewardBlock.Int)
		lastBlockInt  = new(big.Int).Set(&firstRewardBlock.Int)
	)

	for _, reward := range winnings {
		var (
			winner      = reward.Winner
			winAmount   = &reward.WinAmount.Int
			utility     = reward.Utilityname
			blockNumber = &reward.BlockNumber.Int
			category    = reward.Category
		)

		if category != expectedCategory {
			return misc.BigInt{}, misc.BigInt{}, nil, fmt.Errorf(
				"Category doesn't match when batching winnings! Expected %+v, got %+v!",
				expectedCategory,
				category,
			)
		}

		var (
			blockNumBeforeFirstBlock = blockNumber.Cmp(firstBlockInt) < 0
			blockNumAfterLastBlock   = lastBlockInt.Cmp(blockNumber) < 0
		)

		if blockNumBeforeFirstBlock {
			firstBlockInt.Set(blockNumber)
		}
		if blockNumAfterLastBlock {
			lastBlockInt.Set(blockNumber)
		}

		_, exists := rewards[utility]
		if !exists {
			rewards[utility] = make(map[ethereum.Address]misc.BigInt)
		}

		rewardInt, exists := rewards[utility][winner]
		if !exists {
			rewardInt = misc.BigIntFromInt64(0)
		}

		rewardInt.Add(&rewardInt.Int, winAmount)

		rewards[utility][winner] = rewardInt
	}

	var (
		firstBlock = misc.NewBigIntFromInt(*firstBlockInt)
		lastBlock  = misc.NewBigIntFromInt(*lastBlockInt)
	)

	return firstBlock, lastBlock, rewards, nil
}
