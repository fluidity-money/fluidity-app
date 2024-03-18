// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package main

import (
	"math"
	"math/big"

	"github.com/fluidity-money/fluidity-app/lib/databases/postgres/solana"
	"github.com/fluidity-money/fluidity-app/lib/databases/timescale/lootboxes"
	database "github.com/fluidity-money/fluidity-app/lib/databases/timescale/winners"
	"github.com/fluidity-money/fluidity-app/lib/log"
	queue "github.com/fluidity-money/fluidity-app/lib/queues/winners"
	"github.com/fluidity-money/fluidity-app/lib/types/network"
)

// lootboxUpdateTrackedRewardAmounts by destructuring the winner, and
// upserting it into the database. queries the current epoch to get what
// should be used.
func lootboxUpdateTrackedRewardAmounts(winner queue.Winner) {
	var (
		network_     = winner.Network
		tokenDetails = winner.TokenDetails
		application  = winner.Application
		amountWon    = &winner.WinningAmount.Int
	)

	_, lootboxHasBegun, lootboxCurrentEpoch, _ := lootboxes.GetLootboxConfig()

	if !lootboxHasBegun {
		log.Debug(func(k *log.Log) {
			k.Message = "Lootbox not running! Ignoring a winner to be inserted in the lootbox tracked rewards!"
		})

		return
	}

	var (
		tokenShortName = tokenDetails.TokenShortName
		tokenDecimals  = tokenDetails.TokenDecimals
	)

	winnerAddress := ""

	// need to set it to the owner of the ATA if we're on solana!

	switch network_ {
	case network.NetworkSolana:
		winnerAddress = winner.SolanaWinnerOwnerAddress

	default:
		winnerAddress = winner.WinnerAddress
	}

	// we can normalise this and store it in the database to avoid an
	// extra check, as we can afford some loss in this calculation.

	decimals := math.Pow10(tokenDecimals)

	amountNormal := new(big.Rat).SetInt(amountWon)
	amountNormal.Quo(amountNormal, new(big.Rat).SetInt64(int64(decimals)))

	amountNormalFloat, _ := amountNormal.Float64()

	lootboxes.UpdateOrInsertAmountsRewarded(
		network_,
		lootboxCurrentEpoch,
		tokenShortName,
		amountNormalFloat, // amount normal lossy
		winnerAddress,
		application,
	)
}

func main() {
	go queue.WinnersEthereum(func(winner queue.Winner) {
		lootboxUpdateTrackedRewardAmounts(winner)
		database.InsertWinner(winner)
	})

	queue.WinnersSolana(func(winner queue.Winner) {
		winningSignature := solana.GetIntermediateWinner(winner.TransactionHash)
		winner.SendTransactionHash = winningSignature
		lootboxUpdateTrackedRewardAmounts(winner)
		database.InsertWinner(winner)
	})

	queue.WinnersSui(func(winner queue.Winner) {
		database.InsertWinner(winner)
	})
}
