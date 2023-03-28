// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package main

import (
	"math/big"

	"github.com/fluidity-money/fluidity-app/lib/databases/timescale/winners"
	"github.com/fluidity-money/fluidity-app/lib/log"
	queue "github.com/fluidity-money/fluidity-app/lib/queues/winners"
	"github.com/fluidity-money/fluidity-app/lib/types/applications"
	"github.com/fluidity-money/fluidity-app/lib/types/misc"
)

func main() {
	queue.WinnersEthereum(func(winner queue.Winner) {
		var (
			network           = winner.Network
			transactionHash   = winner.SendTransactionHash
			winnerAddress     = winner.WinnerAddress
			amount            = winner.WinningAmount
			tokenDetails      = winner.TokenDetails
			rewardTier        = winner.RewardTier
			applicationString = winner.Application
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

		// sender payouts are 80%, so multiply by 1.25 to get the full volume
		var (
			amountInt = &amount.Int
			four      = big.NewInt(4)

			quarter = new(big.Int)
		)

		// a + (a / 4)
		quarter = quarter.Div(amountInt, four)
		volume_ := amount.Add(amountInt, quarter)
		volume := misc.NewBigIntFromInt(*volume_)

		transactionAttributes := winners.TransactionAttributes{
			Network:         network,
			Application:     application,
			TransactionHash: transactionHash,
			Address:         winnerAddress,
			Amount:          volume,
			TokenDetails:    tokenDetails,
			RewardTier:      rewardTier,
		}

		winners.InsertTransactionAttributes(transactionAttributes)
	})
}
