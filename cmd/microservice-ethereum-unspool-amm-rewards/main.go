// Copyright 2023 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package main

import (
	"github.com/fluidity-money/fluidity-app/common/ethereum"
	"github.com/fluidity-money/fluidity-app/common/ethereum/amm"
	ammDb "github.com/fluidity-money/fluidity-app/lib/databases/timescale/amm"
	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/queue"
	ethQueue "github.com/fluidity-money/fluidity-app/lib/queues/ethereum"
	appTypes "github.com/fluidity-money/fluidity-app/lib/types/applications"
	ethTypes "github.com/fluidity-money/fluidity-app/lib/types/ethereum"
	"github.com/fluidity-money/fluidity-app/lib/types/misc"
	"github.com/fluidity-money/fluidity-app/lib/types/worker"
	"github.com/fluidity-money/fluidity-app/lib/util"
)

const (
	// EnvAmmAddress to track events emitted by the AMM
	EnvAmmAddress = `FLU_ETHEREUM_AMM_ADDRESS`

	EnvLpSenderQueue = `FLU_ETHEREUM_LP_REWARD_AMQP_QUEUE_NAME`
)

func main() {
	var (
		ammAddress_ = util.GetEnvOrFatal(EnvAmmAddress)
		lpQueue     = util.GetEnvOrFatal(EnvLpSenderQueue)
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
		case amm.AmmAbi.Events["CollectFees"].ID:
			handleCollect(log_, lpQueue)
		default:
			// swaps are handled in microservice-eth-user-actions and in the apps server
		}
	})
}

func handleCollect(log_ ethQueue.Log, lpQueue string) {
	collect, err := amm.DecodeCollectFees(log_)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Message = "Failed to decode amm collect event!"
			k.Payload = err
		})
	}

	rewards := ammDb.GetAndRemoveRewardsForLp(collect.Id)

	// collate the rewards
	collatedRewards := make(map[appTypes.UtilityName]misc.BigInt)

	for _, reward := range rewards {
		var (
			utility = reward.Utility
			amount  = reward.Amount
		)

		combined, exists := collatedRewards[utility]

		if !exists {
			combined = misc.BigIntFromInt64(0)
		}

		combined.Add(&combined.Int, &amount.Int)

		collatedRewards[utility] = combined
	}

	announcement := worker.EthereumSpooledLpRewards{
		Rewards: map[appTypes.UtilityName]misc.BigInt{},
		Address: ethTypes.Address{},
	}

	queue.SendMessage(lpQueue, announcement)
}
