package ido

import (
	"github.com/fluidity-money/fluidity-app/lib/queue"
	"github.com/fluidity-money/fluidity-app/lib/types/ido"
)

const (
	// TopicTvlUpdates is used to send the current TVL for the ido auction
	TopicTvlUpdates = `ido.solana.tvl`

	// TopicExchangeUpdates is used to send the calculated exchange rate for
	// the ido auction
	TopicExchangeUpdates = `ido.solana.exchange`
)

type (
	TvlUpdateContainer      = ido.TvlUpdateContainer
	ExchangeUpdateContainer = ido.ExchangeUpdateContainer
)

func TvlUpdates(f func(TvlUpdateContainer)) {
	queue.GetMessages(TopicTvlUpdates, func(message queue.Message) {
		var log TvlUpdateContainer

		message.Decode(&log)

		f(log)
	})
}

func ExchangeUpdates(f func(ExchangeUpdateContainer)) {
	queue.GetMessages(TopicExchangeUpdates, func(message queue.Message) {
		var log ExchangeUpdateContainer

		message.Decode(&log)

		f(log)
	})
}
