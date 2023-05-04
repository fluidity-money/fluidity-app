// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package main

import (
	"time"

	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/queue"
	"github.com/fluidity-money/fluidity-app/lib/queues/user-actions"
	"github.com/fluidity-money/fluidity-app/lib/types/ethereum"
	"github.com/fluidity-money/fluidity-app/lib/types/misc"
	"github.com/fluidity-money/fluidity-app/lib/types/network"

	"github.com/fluidity-money/fluidity-app/cmd/microservice-ethereum-user-actions/lib"
)

// ZeroAddress is ignored when sent to by ending handleTransfer early
const ZeroAddress = "0x0000000000000000000000000000000000000000"

func handleTransfer(network_ network.BlockchainNetwork, transactionHash ethereum.Hash, logTopics []ethereum.Hash, data []byte, time time.Time, tokenShortName string, tokenDecimals int, logIndex misc.BigInt) {
	if lenTopics := len(logTopics); lenTopics != 2 {
		log.Fatal(func(k *log.Log) {
			k.Format(
				"Length of the log topics for transfer is not 2! Is %v!",
				lenTopics,
			)
		})
	}

	var (
		fromAddressPadded = logTopics[0].String()
		toAddressPadded   = logTopics[1].String()
	)

	transfer, err := microservice_user_actions.DecodeTransfer(
		network_,
		transactionHash,
		fromAddressPadded,
		toAddressPadded,
		data,
		time,
		tokenShortName,
		tokenDecimals,
		logIndex,
	)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Message = "Failed to decode a transfer event to a user action!"
			k.Payload = err
		})
	}

	// transfers from or to the zero address are swaps

	if transfer.SenderAddress == ZeroAddress || transfer.RecipientAddress == ZeroAddress {
		return
	}

	queue.SendMessage(
		user_actions.TopicUserActionsEthereum,
		transfer,
	)
}
