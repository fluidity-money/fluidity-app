// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package ethereum

import (
	"fmt"

	"github.com/fluidity-money/fluidity-app/lib/types/ethereum"
	"github.com/fluidity-money/fluidity-app/lib/types/misc"
	token_details "github.com/fluidity-money/fluidity-app/lib/types/token-details"
	"github.com/fluidity-money/fluidity-app/lib/types/worker"
)

func foldWinnings(reward worker.EthereumReward, spooledReward worker.EthereumSpooledRewards, exists bool) worker.EthereumSpooledRewards {
	var (
		blockNumber = reward.BlockNumber
		network     = reward.Network
		token       = reward.TokenDetails
		amount      = reward.WinAmount
		winner      = reward.Winner
		hash        = reward.TransactionHash
	)

	if !exists {
		spooledReward.Network = network
		spooledReward.Token = token
		spooledReward.Winner = winner
		spooledReward.TransactionHash = hash
		spooledReward.WinAmount = new(misc.BigInt)
		spooledReward.FirstBlock = new(misc.BigInt)
		spooledReward.LastBlock = new(misc.BigInt)

		spooledReward.FirstBlock.Set(&blockNumber.Int)
		spooledReward.LastBlock.Set(&blockNumber.Int)
	}

	spooledReward.WinAmount.Add(&spooledReward.WinAmount.Int, &amount.Int)

	var (
		blockNumBeforeFirstBlock = blockNumber.Cmp(&spooledReward.FirstBlock.Int) < 0
		blockNumAfterLastBlock   = spooledReward.LastBlock.Cmp(&blockNumber.Int) < 0
	)

	if blockNumBeforeFirstBlock {
		spooledReward.FirstBlock.Set(&blockNumber.Int)
	}

	if blockNumAfterLastBlock {
		spooledReward.LastBlock.Set(&blockNumber.Int)
	}

	return spooledReward
}

// BatchWinningsByUser batches winnings that have the same token, returning
// the total winnings each user has earned
func BatchWinningsByUser(winnings []worker.EthereumReward, expectedToken token_details.TokenDetails) (map[ethereum.Address]worker.EthereumSpooledRewards, error) {
	spooledWinnings := make(map[ethereum.Address]worker.EthereumSpooledRewards)

	for _, reward := range winnings {
		var (
			token  = reward.TokenDetails
			winner = reward.Winner
		)

		if token != expectedToken {
			return spooledWinnings, fmt.Errorf(
				"Token doesn't match when batching winnings! Expected %+v, got %+v!",
				expectedToken,
				token,
			)
		}

		spooledReward, exists := spooledWinnings[winner]

		updatedReward := foldWinnings(reward, spooledReward, exists)

		spooledWinnings[winner] = updatedReward
	}

	return spooledWinnings, nil
}

// BatchWinningsByToken batches winnings that have the same winner together, returning the
// set of tokens and their winnings for each
func BatchWinningsByToken(winnings []worker.EthereumReward, address ethereum.Address) (map[string]worker.EthereumSpooledRewards, error) {
	spooledWinnings := make(map[string]worker.EthereumSpooledRewards)

	for _, reward := range winnings {
		var (
			token     = reward.TokenDetails
			tokenName = token.TokenShortName
			winner    = reward.Winner
		)

		if winner != address {
			return spooledWinnings, fmt.Errorf(
				"Address doesn't match when batching winnings! Expected %s, got %s!",
				address.String(),
				winner.String(),
			)
		}

		spooledReward, exists := spooledWinnings[tokenName]

		updatedReward := foldWinnings(reward, spooledReward, exists)

		spooledWinnings[tokenName] = updatedReward
	}

	return spooledWinnings, nil
}
