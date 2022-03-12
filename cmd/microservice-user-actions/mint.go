package main

import (
	"time"

	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/queue"
	"github.com/fluidity-money/fluidity-app/lib/queues/user-actions"
	"github.com/fluidity-money/fluidity-app/lib/types/ethereum"

	"github.com/fluidity-money/fluidity-app/cmd/microservice-user-actions/lib"
)

func handleMint(transactionHash ethereum.Hash, topics []ethereum.Hash, time time.Time, tokenShortName string, tokenDecimals int) {
	if lenTopics := len(topics); lenTopics != 2 {
		log.Fatal(func(k *log.Log) {
			k.Format(
				"Length of the topic for the transfer is not 2! Was %v!",
				lenTopics,
			)
		})
	}

	var (
		addressPadded = string(topics[0])
		amountPadded  = string(topics[1])
	)

	address, amount, err := microservice_user_actions.DecodeTwoLog(
		addressPadded,
		amountPadded,
	)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Message = "Failed to decide a mint event with a two log!"
			k.Payload = err
		})
	}

	mint := user_actions.NewSwap(
		networkEthereum,
		address,
		string(transactionHash),
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
