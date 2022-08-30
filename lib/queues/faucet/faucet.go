// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package faucet

import (
	"github.com/fluidity-money/fluidity-app/lib/queue"
	"github.com/fluidity-money/fluidity-app/lib/types/faucet"
)

const TopicFaucetRequest = "faucet.requests"

type FaucetRequest = faucet.FaucetRequest

func FaucetRequests(f func(request FaucetRequest)) {
	queue.GetMessages(TopicFaucetRequest, func(m queue.Message) {
		var faucetRequest FaucetRequest

		m.Decode(&faucetRequest)

		f(faucetRequest)
	})
}
