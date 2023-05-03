// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package main

import (
	"math"
	"math/big"
	"time"

	database "github.com/fluidity-money/fluidity-app/lib/databases/timescale/lootboxes"
	user_actions "github.com/fluidity-money/fluidity-app/lib/databases/timescale/user-actions"
	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/queue"
	lootboxes_queue "github.com/fluidity-money/fluidity-app/lib/queues/lootboxes"
	winners_queue "github.com/fluidity-money/fluidity-app/lib/queues/winners"
	"github.com/fluidity-money/fluidity-app/lib/types/applications"
	"github.com/fluidity-money/fluidity-app/lib/types/lootboxes"
	"github.com/fluidity-money/fluidity-app/lib/types/misc"
)

func main() {
	winners_queue.WinnersEthereum(func(winner winners_queue.Winner) {
		var (
			network           = winner.Network
			transactionHash   = winner.SendTransactionHash
			winnerAddress     = winner.WinnerAddress
			awardedTime       = winner.AwardedTime
			tokenDetails      = winner.TokenDetails
			rewardTier        = winner.RewardTier
			applicationString = winner.Application
			logIndex          = winner.SendTransactionLogIndex
		)

		// don't track fluidification
		if winner.RewardType != "send" {
			log.Debug(func(k *log.Log) {
				k.Format(
					"Winner %s in transaction %s is a recipient, skipping!",
					winnerAddress,
					transactionHash,
				)
			})
		}

		// all applications qualify, including a regular send (ApplicationNone)
		application, err := applications.ParseApplicationName(applicationString)

		if err != nil {
			log.Fatal(func(k *log.Log) {
				k.Message = "Failed to parse application name!"
				k.Payload = err
			})
		}

		// fetch volume of sending transaction
		// transaction hash and log index guarantee uniqueness
		sendTransaction := user_actions.GetUserActionByLogIndex(network, transactionHash, logIndex)

		// sender payouts are 80%, so multiply by 1.25 to get the full volume
		var (
			amountInt = &sendTransaction.Amount.Int
			four      = big.NewInt(4)

			quarter = new(big.Int)
			volume_ = new(big.Int)
		)

		// a + (a / 4)
		quarter = quarter.Div(amountInt, four)
		volume_ = volume_.Add(amountInt, quarter)
		volume := misc.NewBigIntFromInt(*volume_)

		// Calculate lootboxes earned from transaction
		// ((volume / (10 ^ token_decimals)) / 3) + calculate_a_y(address, awarded_time)) * protocol_multiplier(ethereum_application)
		lootboxCount := new(big.Rat).Mul(
			volumeLiquidityMultiplier(
				volume,
				tokenDetails.TokenDecimals,
				winnerAddress,
				awardedTime,
			),
			protocolMultiplier(application),
		)

		lootboxCountFloat, exact := lootboxCount.Float64()

		if exact != true {
			log.Debug(func(k *log.Log) {
				k.Format(
					"Lootbox count for hash %v and winner %v was not an exact float, was %v",
					transactionHash,
					winnerAddress,
					lootboxCount.String(),
				)
			})
		}

		lootbox := lootboxes_queue.Lootbox{
			Address:         winnerAddress,
			Source:          lootboxes.Transaction,
			TransactionHash: transactionHash,
			AwardedTime:     awardedTime,
			Volume:          volume,
			RewardTier:      rewardTier,
			LootboxCount:    lootboxCountFloat,
		}

		queue.SendMessage(lootboxes_queue.TopicLootboxes, lootbox)
	})
}

func volumeLiquidityMultiplier(volume misc.BigInt, tokenDecimals int, address string, time time.Time) *big.Rat {
	volumeLiquidityNum := new(big.Rat).SetInt(&volume.Int)

	tokenDecimalsRat := new(big.Rat).SetFloat64(math.Pow10(tokenDecimals) * 3)
	volumeLiquidityDenom := new(big.Rat).Inv(tokenDecimalsRat)

	volumeLiquidityRat := new(big.Rat).Mul(volumeLiquidityNum, volumeLiquidityDenom)

	liquidityMultiplier := new(big.Rat).SetFloat64(database.Calculate_A_Y(address, time))

	volumeLiquidityMultiplier := new(big.Rat).Add(volumeLiquidityRat, liquidityMultiplier)

	return volumeLiquidityMultiplier
}

func protocolMultiplier(application applications.Application) *big.Rat {
	switch application.String() {
	case "uniswap_v2":
	case "uniswap_v3":
	case "saddle":
	case "curve":
		return big.NewRat(2, 1)
	}

	return big.NewRat(1, 3)
}
