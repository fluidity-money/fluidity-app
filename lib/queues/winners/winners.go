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

	// TopicBlockedWinnersEthereum to broadcast winner messages containing
	// a single blocked winner and their amount won
	TopicBlockedWinnersEthereum = `blocked_winners.` + string(network.NetworkEthereum)

	// TopicWinnersSolana to broadcast winner messages containing a single
	// winner and their amount won
	TopicWinnersSolana = `winners.` + string(network.NetworkSolana)

	// TopicBlockedWinnersSolana to broadcast winner messages containing
	// a single blocked winner and their amount won
	TopicBlockedWinnersSolana = `blocked_winners.` + string(network.NetworkSolana)

	// TopicWinnersSui to broadcast winner messages containing a single
	// winner and their amount won
	TopicWinnersSui = `winners.` + string(network.NetworkSui)

	// subWinnersAll to subscribe to winner messages from all networks
	subWinnersAll = `winners.*`

	// subBlockedWinnersAll to subscribe to blocked winner messages from all networks
	subBlockedWinnersAll = `blocked_winners.*`

	// TopicPendingWinners to broadcast pending winner messages on ethereum or sui
	TopicPendingWinners = `pending_winners`
)

type (
	Winner        = types.Winner
	PendingWinner = types.PendingWinner
	BlockedWinner = types.BlockedWinner
	RewardData    = fluidity.RewardData
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

func BlockedWinnersAll(f func(BlockedWinner)) {
	queue.GetMessages(subBlockedWinnersAll, func(message queue.Message) {
		var blockedWinner BlockedWinner

		message.Decode(&blockedWinner)

		f(blockedWinner)
	})
}

func PendingWinners(f func([]PendingWinner)) {
	queue.GetMessages(TopicPendingWinners, func(message queue.Message) {
		var pendingWinners []PendingWinner

		message.Decode(&pendingWinners)

		f(pendingWinners)
	})
}
