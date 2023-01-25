// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package main

import (
	"encoding/hex"
	"time"

	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/queue"
	"github.com/fluidity-money/fluidity-app/lib/queues/user-actions"
	"github.com/fluidity-money/fluidity-app/lib/types/ethereum"
	"github.com/fluidity-money/fluidity-app/lib/types/misc"
	"github.com/fluidity-money/fluidity-app/lib/types/network"

	"github.com/fluidity-money/fluidity-app/cmd/microservice-ethereum-user-actions/lib"
)

func handleMint(network_ network.BlockchainNetwork, transactionHash ethereum.Hash, topics []ethereum.Hash, data misc.Blob, time time.Time, tokenShortName string, tokenDecimals int) {
	if lenTopics := len(topics); lenTopics != 1 {
		log.Fatal(func(k *log.Log) {
			k.Format(
				"Length of the topic for the mint is not 1! Was %v!",
				lenTopics,
			)
		})
	}

	var (
		addressPadded = topics[0].String()
		amountPadded  = hex.EncodeToString(data)
	)

	address_, amount, err := microservice_user_actions.DecodeTwoLog(
		addressPadded,
		amountPadded,
	)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Message = "Failed to decide a mint event with a two log!"
			k.Payload = err
		})
	}

	address := ethereum.AddressFromString(address_)

	mint := user_actions.NewSwapEthereum(
		network_,
		address,
		transactionHash,
		*amount,
		true,
		tokenShortName,
		tokenDecimals,
	)

	queue.SendMessage(
		user_actions.TopicUserActionsEthereum,
		mint,
	)
}
