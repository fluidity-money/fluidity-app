// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package main

import (
	"math/big"
	"math"

	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/queues/winners"
	"github.com/fluidity-money/fluidity-app/lib/databases/timescale/user-actions"
)

func pow10(x int) *big.Rat {
	return new(big.Rat).SetFloat64(math.Pow10(x))
}

func main() {
	winners.WinnersEthereum(func(winner winners.Winner) {
		var (
			transactionHash = winner.TransactionHash
			sendTransationHash = winner.SendTransactionHash
			sendTransactionLogIndex = winner.SendTransactionLogIndex
		)

		network_, err := network.ParseEthereumNetwork(winner.Network)

		if err != nil {
			log.Fatal(func(k *log.Log) {
				k.Format("Failed to parse network %#v!", winner.Network)
				k.Payload = err
			})
		}

		userAction := user_actions.GetUserActionByLogIndex(
			network_,
			transactionHash,
			logIndex,
		)

		tokenDecimals := userAction.TokenDetails.TokenDecimals

		amountUsed := new(big.Rat).SetInt(&userAction.Amount.Int)

		amountUsed.Quo(amount, pow10(userAction.tokenDecimals))


	})
}
