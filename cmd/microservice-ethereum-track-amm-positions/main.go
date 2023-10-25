// Copyright 2023 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package main

import (
	"github.com/fluidity-money/fluidity-app/common/ethereum"
	"github.com/fluidity-money/fluidity-app/common/ethereum/amm"
	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/queue"
	ammQueue "github.com/fluidity-money/fluidity-app/lib/queues/amm"
	ethQueue "github.com/fluidity-money/fluidity-app/lib/queues/ethereum"
	ethTypes "github.com/fluidity-money/fluidity-app/lib/types/ethereum"
	"github.com/fluidity-money/fluidity-app/lib/util"
)

const (
	// EnvAmmAddress to track events emitted by the AMM
	EnvAmmAddress = `FLU_ETHEREUM_AMM_ADDRESS`
)

func main() {
	var (
		ammAddress_ = util.GetEnvOrFatal(EnvAmmAddress)
	)

	ammAddress := ethTypes.AddressFromString(ammAddress_)

	ethQueue.Logs(func(log_ ethQueue.Log) {
		if log_.Address != ammAddress {
			return
		}

		if len(log_.Topics) < 1 {
			log.Fatal(func(k *log.Log) {
				k.Message = "Failed to decode a log from the AMM! No topics!"

				k.Payload = log_
			})
		}

		topic := ethereum.ConvertInternalHash(log_.Topics[0])

		switch topic {
		case amm.AmmAbi.Events["MintPosition"].ID:
			handleMint(log_)
		case amm.AmmAbi.Events["UpdatePositionLiquidity"].ID:
			handleUpdate(log_)
		default:
			// swaps are handled in microservice-eth-user-actions and in the apps server
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

func handleUpdate(log_ ethQueue.Log) {
	update, err := amm.DecodeUpdatePosition(log_)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Message = "Failed to decode amm mint event!"
			k.Payload = err
		})
	}

	queue.SendMessage(ammQueue.TopicPositionUpdate, update)
}
