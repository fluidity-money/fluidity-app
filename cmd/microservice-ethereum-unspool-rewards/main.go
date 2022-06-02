package main

import (
	"github.com/fluidity-money/fluidity-app/lib/databases/timescale/spooler"
	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/queues/winners"
)

func main() {
	winners.RewardsEthereum(func(reward winners.RewardData) {
		var (
			winnerAddress = reward.Winner.String()
			startBlock = reward.StartBlock
			endBlock = reward.EndBlock
			token = reward.TokenDetails

			tokenShortName = token.TokenShortName
		)

		log.App(func(k *log.Log) {
			k.Format(
				"Winnings for user %s for blocks %s-%s, token %s were paid out, removing from spooler!",
				winnerAddress,
				startBlock.String(),
				endBlock.String(),
				tokenShortName,
			)
		})

		spooler.RemovePendingWinnings(token, winnerAddress, startBlock, endBlock)
	})
}
