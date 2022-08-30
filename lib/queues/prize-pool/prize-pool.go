// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package prize_pool

import (
	"github.com/fluidity-money/fluidity-app/lib/queue"
	"github.com/fluidity-money/fluidity-app/lib/types/network"
	"github.com/fluidity-money/fluidity-app/lib/types/prize-pool"
)

// TopicPrizePool to use to distribute the high level representation
// of the prize pool via
const (
	TopicPrizePoolEthereum = `prize_pool.` + string(network.NetworkEthereum)
	TopicPrizePoolSolana   = `prize_pool.` + string(network.NetworkSolana)
	subPrizePoolAll        = `prize_pool.*`
)

type PrizePool = prize_pool.PrizePool

func prizePoolUpdates(topic string, f func(PrizePool)) {
	queue.GetMessages(topic, func(message queue.Message) {
		var prizePool PrizePool

		message.Decode(&prizePool)

		f(prizePool)
	})
}

func PrizePoolUpdatesEthereum(f func(PrizePool)) {
	prizePoolUpdates(TopicPrizePoolEthereum, f)
}

func PrizePoolUpdatesSolana(f func(PrizePool)) {
	prizePoolUpdates(TopicPrizePoolSolana, f)
}

func PrizePoolUpdatesAll(f func(PrizePool)) {
	prizePoolUpdates(subPrizePoolAll, f)
}
