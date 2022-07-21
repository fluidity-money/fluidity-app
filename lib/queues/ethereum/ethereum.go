// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE file.

package ethereum

// ethereum contains queue code that receives blocks, transactions and
// receipts from upstream, safely decoding it appropriately. Intended
// to be used with a fanout exchange, so topic names are randomly chosen.

import "github.com/fluidity-money/fluidity-app/lib/queue"

const (
	// TopicLogs follow to get every contract log that's confirmed
	TopicLogs = "ethereum.log"

	// TopicBlockHeaders follow to get every block header seen
	TopicBlockHeaders = "ethereum.block.header"
)

func Logs(f func(Log)) {
	queue.GetMessages(TopicLogs, func(message queue.Message) {
		var log Log

		message.Decode(&log)

		f(log)
	})
}

func BlockHeaders(f func(BlockHeader)) {
	queue.GetMessages(TopicBlockHeaders, func(message queue.Message) {
		var header BlockHeader

		message.Decode(&header)

		f(header)
	})
}
