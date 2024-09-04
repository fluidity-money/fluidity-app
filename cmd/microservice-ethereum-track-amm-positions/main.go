// Copyright 2023 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package main

import (
	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/queue"
	ammQueue "github.com/fluidity-money/fluidity-app/lib/queues/amm"
	ethQueue "github.com/fluidity-money/fluidity-app/lib/queues/ethereum"
	ethTypes "github.com/fluidity-money/fluidity-app/lib/types/ethereum"
	"github.com/fluidity-money/fluidity-app/lib/util"
	ammTimescale "github.com/fluidity-money/fluidity-app/lib/databases/timescale/amm"

	"github.com/fluidity-money/fluidity-app/common/ethereum"
	"github.com/fluidity-money/fluidity-app/common/ethereum/amm"
	ethLongtail "github.com/fluidity-money/fluidity-app/common/ethereum/longtail"

	"github.com/ethereum/go-ethereum/ethclient"
)

const (
	// EnvAmmAddress to track events emitted by the AMM
	EnvAmmAddress = `FLU_ETHEREUM_AMM_ADDRESS`

	// EnvEthereumHttpUrl is the url to use to connect to the HTTP Geth endpoint for delta
	// lookups
	EnvEthereumHttpUrl = `FLU_ETHEREUM_HTTP_URL`
)

func main() {
	var (
		ammAddress_ = util.GetEnvOrFatal(EnvAmmAddress)
		gethHttpUrl = util.PickEnvOrFatal(EnvEthereumHttpUrl)
	)

	ethClient, err := ethclient.Dial(gethHttpUrl)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Message = "Failed to connect to Geth Websocket!"
			k.Payload = err
		})
	}

	defer ethClient.Close()

	ammAddress := ethTypes.AddressFromString(ammAddress_)

	ethQueue.Logs(func(log_ ethQueue.Log) {
		log.Debugf("got a log: %v", log_)

		if log_.Address != ammAddress {
			return
		}

		if len(log_.Topics) < 1 {
			log.Fatal(func(k *log.Log) {
				k.Format(
					"Failed to decode a log with hash %s from the AMM! No topics!",
					log_.TxHash,
				)

				k.Payload = log_
			})
		}

		topic := ethereum.ConvertInternalHash(log_.Topics[0])

		switch topic {
		case amm.AmmAbi.Events["MintPosition"].ID:
			handleMint(log_)
		case amm.AmmAbi.Events["UpdatePositionLiquidity"].ID:
			handleUpdate(ethClient, ammAddress, log_)
		default:
			// swaps are handled in microservice-eth-user-actions and in the apps server
			log.App(func(k *log.Log) {
				k.Format(
					"Ignoring log with irrelevant topic %+v",
					log_,
				)
			})
		}
	})
}

func handleMint(log_ ethQueue.Log) {
	mint, err := amm.DecodeMint(log_)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Message = "Failed to decode amm mint event!"
			k.Payload = err
		})
	}

	queue.SendMessage(ammQueue.TopicPositionMint, mint)
}

func handleUpdate(client *ethclient.Client, ammAddress ethTypes.Address, log_ ethQueue.Log) {
	update, err := amm.DecodeUpdatePosition(log_)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Message = "Failed to decode amm mint event!"
			k.Payload = err
		})
	}

	// get the pool associated with this position

	positionId := update.Id

	pool := ammTimescale.GetPositionPool(positionId)

	// get the delta so we can use it later in the database

	delta := ethLongtail.GetPositionLiquidity(client, ammAddress, pool, positionId)

	update.Delta = delta

	queue.SendMessage(ammQueue.TopicPositionUpdate, update)
}
