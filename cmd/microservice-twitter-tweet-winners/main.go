// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package main

import (
	"github.com/ethereum/go-ethereum/ethclient"

	"github.com/fluidity-money/fluidity-app/lib/util"
	"github.com/fluidity-money/fluidity-app/lib/databases/timescale/user-actions"
	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/queues/winners"
)

// EnvEthereumHttpUrl is the url to use to connect to the HTTP geth endpoint
const EnvEthereumHttpUrl = `FLU_ETHEREUM_HTTP_URL`

func main() {
	ethereumHttpAddress := util.PickEnvOrFatal(EnvEthereumHttpUrl)

	ethClient, err := ethclient.Dial(ethereumHttpAddress)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Message = "Failed to dial into Geth!"
			k.Payload = err
		})
	}

	winners.WinnersEthereum(func(winner winners.Winner) {
		var (
			transactionHash         = winner.TransactionHash
			winnerAddress = winner.WinnerAddress
			sendTransationHash      = winner.SendTransactionHash
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

		// test if the sender is a contract, and if they are
	})
}
