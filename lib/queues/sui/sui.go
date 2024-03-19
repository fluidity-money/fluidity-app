// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package sui

// sui contains queue code that receives
// from upstream, safely decoding it appropriately. Intended
// to be used with a fanout exchange, so topic names are randomly chosen.

import (
	"github.com/fluidity-money/fluidity-app/lib/queue"
	"github.com/fluidity-money/fluidity-app/lib/types/worker"
)

const (
	// TopicCheckpoints to get a summary of every checkpoint
	TopicCheckpoints = "sui.checkpoint"

	// TopicDecoratedTransfers to get decorated transfers to process with a worker
	TopicDecoratedTransfers = "sui.decorated_transfer"
)

type SuiAppFees = worker.SuiAppFees

func Checkpoints(f func(Checkpoint)) {
	queue.GetMessages(TopicCheckpoints, func(message queue.Message) {
		var checkpoint Checkpoint

		message.Decode(&checkpoint)

		f(checkpoint)
	})
}

func DecoratedTransfers(f func([]DecoratedTransfer)) {
	queue.GetMessages(TopicDecoratedTransfers, func(message queue.Message) {
		var decoratedTransfers []DecoratedTransfer

		message.Decode(&decoratedTransfers)

		f(decoratedTransfers)
	})
}
