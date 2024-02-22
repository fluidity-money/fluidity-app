// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package sui

// sui contains queue code that receives 
// from upstream, safely decoding it appropriately. Intended
// to be used with a fanout exchange, so topic names are randomly chosen.

import "github.com/fluidity-money/fluidity-app/lib/queue"

const (
	// TopicCheckpoints to get a summary of every checkpoint
	TopicCheckpoints = "sui.checkpoint"

)

func Checkpoints(f func(Checkpoint)) {
	queue.GetMessages(TopicCheckpoints, func(message queue.Message) {
		var checkpoint Checkpoint

		message.Decode(&checkpoint)

		f(checkpoint)
	})
}
