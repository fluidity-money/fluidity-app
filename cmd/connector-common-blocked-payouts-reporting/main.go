package main

import (
	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/log/discord"
	"github.com/fluidity-money/fluidity-app/lib/queues/winners"
)

func main() {
    winners.BlockedWinnersAll(func (blockedWinner winners.Winner) {
        log.App(func(k *log.Log) {
            k.Message = "Received a blocked winner message!"
            k.Payload = blockedWinner
        })

        discord.Notify(
            discord.SeverityNotice,
            "Saw a blocked payout! %+v",
            blockedWinner,
        )
    })
}
