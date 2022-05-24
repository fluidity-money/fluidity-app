package main

import (
	"github.com/fluidity-money/fluidity-app/lib/databases/timescale/spooler"
	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/queues/winners"
)

func main() {
	winners.RewardsEthereum(func(reward winners.RewardData) {
		transactionHash := reward.TxHash.String()

		log.Debug(func(k *log.Log) {
			k.Format(
				"Transaction %s was paid out, removing from spooler!",
				transactionHash,
			)
		})

		spooler.RemovePendingWinner(transactionHash)
	})
}
