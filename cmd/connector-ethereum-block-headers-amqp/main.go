// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE file.

package main

import (
	"context"

	ethCommon "github.com/fluidity-money/fluidity-app/common/ethereum"
	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/queue"
	ethQueue "github.com/fluidity-money/fluidity-app/lib/queues/ethereum"
	"github.com/fluidity-money/fluidity-app/lib/util"

	ethTypes "github.com/ethereum/go-ethereum/core/types"
	"github.com/ethereum/go-ethereum/ethclient"
	ethRpc "github.com/ethereum/go-ethereum/rpc"
)

// EnvEthereumWsUrl is the url to use to connect to the WS Geth endpoint
const EnvEthereumWsUrl = `FLU_ETHEREUM_WS_URL`

func main() {
	gethWebsocketUrl := util.GetEnvOrFatal(EnvEthereumWsUrl)

	rpcClient, err := ethRpc.Dial(gethWebsocketUrl)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Message = "Failed to connect to Geth Websocket!"
			k.Payload = err
		})
	}

	gethClient := ethclient.NewClient(rpcClient)

	headers := make(chan *ethTypes.Header)

	newHeadsSubscription, err := gethClient.SubscribeNewHead(
		context.Background(),
		headers,
	)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Message = "Could not subscribe to New Blocks!"
			k.Payload = err
		})
	}

	defer newHeadsSubscription.Unsubscribe()

	for {
		select {
		case err := <-newHeadsSubscription.Err():
			log.Fatal(func(k *log.Log) {
				k.Message = "NewHeads subscription returned an error!"
				k.Payload = err
			})

		case header := <-headers:
			newHeader := ethCommon.ConvertHeader(header)

			log.Debug(func(k *log.Log) {
				k.Format("Sending Block Header: %v", newHeader.BlockHash)
			})

			queue.SendMessage(ethQueue.TopicBlockHeaders, newHeader)
		}

	}
}
