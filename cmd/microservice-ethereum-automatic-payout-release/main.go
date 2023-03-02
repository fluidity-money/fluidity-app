// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package main

import (
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

    // EnvTokens to list which tokens to send winnings for
    EnvTokens = `FLU_ETHEREUM_TOKENS_LIST`

	// EnvNetwork to differentiate between eth, arbitrum, etc
	EnvNetwork = `FLU_ETHEREUM_NETWORK`
)

func main() {
    var (
        senderQueueName = util.GetEnvOrFatal(EnvPublishAmqpQueueName)
        tokenList       = util.GetEnvOrFatal(EnvTokens)
        network_        = util.GetEnvOrFatal(EnvNetwork)
    )

    baseTokens := util.GetTokensListBase(tokenList)

    tokens := make([]token_details.TokenDetails, len(baseTokens))
    for i, token := range baseTokens {
        decimalsFloat, _ := token.TokenDecimals.Float64()

        decimals := int(decimalsFloat)

        token := token_details.New(
            token.TokenName,
            decimals,
        )

        tokens[i] = token
    }

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

    for _, token := range tokens {
        log.App(func(k *log.Log) {
            k.Format(
                "Now processing network %s, token %s",
                net,
                token,
            )
        })

        rewards, err := spooler.GetRewards(net, token)

        if err != nil {
            log.Fatal(func(k *log.Log) {
                k.Format(
                    "Failed to get rewards for token %s! %+v",
                    token,
                    err,
                )
            })
        }

        queue.SendMessage(senderQueueName, rewards)
    }
}
