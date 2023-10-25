package amm

import (
	"github.com/fluidity-money/fluidity-app/common/ethereum/amm"
	"github.com/fluidity-money/fluidity-app/lib/queue"
)

const (
	TopicPositionMint   = `amm.mint_position`
	TopicPositionUpdate = `amm.update_position`
)

type (
	PositionMint   = amm.PositionMint
	PositionUpdate = amm.PositionUpdate
)

func PositionMintsEthereum(f func(PositionMint)) {
	queue.GetMessages(TopicPositionMint, func(message queue.Message) {
		var mint PositionMint

		message.Decode(&mint)

		f(mint)
	})
}

func PositionUpdatesEthereum(f func(PositionUpdate)) {
	queue.GetMessages(TopicPositionUpdate, func(message queue.Message) {
		var update PositionUpdate

		message.Decode(&update)

		f(update)
	})
}
