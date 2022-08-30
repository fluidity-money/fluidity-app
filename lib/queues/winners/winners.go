// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package winners

// winners contains queue code that receives winners picked up by an event
// and decodes it appropriately.

import (
	"github.com/fluidity-money/fluidity-app/common/ethereum/fluidity"
	"github.com/fluidity-money/fluidity-app/lib/queue"
	"github.com/fluidity-money/fluidity-app/lib/types/network"
	types "github.com/fluidity-money/fluidity-app/lib/types/winners"
)

const (
	// TopicWinnersEthereum to broadcast winner messages containing a single
	// winner and their amount won
	TopicWinnersEthereum = `winners.` + string(network.NetworkEthereum)

	// TopicWinnersSolana to broadcast winner messages containing a single
	// winner and their amount won
	TopicWinnersSolana = `winners.` + string(network.NetworkSolana)

	// subWinnersAll to subscribe to winner messages from either network
	subWinnersAll = `winners.*`
)

type (
	Winner     = types.Winner
	RewardData = fluidity.RewardData
)

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
