package winners

// winners contains queue code that receives winners picked up by an event
// and decodes it appropriately.

import (
	"github.com/fluidity-money/fluidity-app/lib/queue"
	"github.com/fluidity-money/fluidity-app/lib/types/network"
	types "github.com/fluidity-money/fluidity-app/lib/types/winners"
)

const (
	TopicWinnersEthereum = `winners.` + string(network.NetworkEthereum)
	TopicWinnersSolana   = `winners.` + string(network.NetworkSolana)

	subWinnersAll = `winners.*`
)

type Winner = types.Winner

func winners(topic string, f func(Winner)) {
	queue.GetMessages(topic, func(message queue.Message) {
		var winner Winner

		message.Decode(&winner)

		f(winner)
	})
}

func WinnersEthereum(f func(Winner)) {
	winners(TopicWinnersEthereum, f)
}

func WinnersSolana(f func(Winner)) {
	winners(TopicWinnersSolana, f)
}

func WinnersAll(f func(Winner)) {
	winners(subWinnersAll, f)
}
