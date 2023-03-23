// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package main

import (
	"strconv"

	"github.com/fluidity-money/fluidity-app/common/ethereum/spooler"
	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/queue"
	"github.com/fluidity-money/fluidity-app/lib/types/network"
	token_details "github.com/fluidity-money/fluidity-app/lib/types/token-details"
	"github.com/fluidity-money/fluidity-app/lib/util"
)

const (
    // EnvPublishAmqpQueueName is the queue to post batched winners down
    EnvPublishAmqpQueueName = `FLU_ETHEREUM_BATCHED_WINNERS_AMQP_QUEUE_NAME`

    // EnvTokenName to fetch winnings with
    EnvTokenName = `FLU_ETHEREUM_TOKEN_NAME`

    // EnvTokenDecimals to fetch winnings with
    EnvTokenDecimals = `FLU_ETHEREUM_TOKEN_DECIMALS`

    // EnvNetwork to differentiate between eth, arbitrum, etc
    EnvNetwork = `FLU_ETHEREUM_NETWORK`
)

func main() {
    var (
        senderQueueName = util.GetEnvOrFatal(EnvPublishAmqpQueueName)
        shortName       = util.GetEnvOrFatal(EnvTokenName)
        decimals_       = util.GetEnvOrFatal(EnvTokenDecimals)
        network_        = util.GetEnvOrFatal(EnvNetwork)
    )

    decimals, err := strconv.ParseInt(decimals_, 10, 32)

    if err != nil {
        log.Fatal(func(k *log.Log) {
            k.Message = "Failed to parse token decimals from env!"
            k.Payload = err
        })
    }

    token := token_details.New(shortName, int(decimals))

    net, err := network.ParseEthereumNetwork(network_)

    if err != nil {
        log.Fatal(func(k *log.Log) {
            k.Format(
                "Failed to parse db network %s from env! %+v",
                net,
                err,
            )
        })
    }


    rewards, foundRewards, err := spooler.GetRewards(net, token)

    if err != nil {
        log.Fatal(func(k *log.Log) {
            k.Format(
                "Failed to get rewards for token %s! %+v",
                shortName,
                err,
            )
        })
    }

    if foundRewards {
        log.App(func(k *log.Log) {
            k.Format(
                "Sending rewards for token %s",
                shortName,
            )
        })

        queue.SendMessage(senderQueueName, rewards)
    } else {
        log.App(func(k *log.Log) {
            k.Format(
                "No rewards for token %s found!",
                shortName,
            )
        })
    }
}
