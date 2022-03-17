package ethereum

// ethereum contains queue code that receives blocks, transactions and
// receipts from upstream, safely decoding it appropriately. Intended
// to be used with a fanout exchange, so topic names are randomly chosen.

import "github.com/fluidity-money/fluidity-app/lib/queue"

const (
	// TopicLogs follow to get every contract log that's confirmed
	TopicLogs = "ethereum.log"
)

func Logs(f func(Log)) {
	queue.GetMessages(TopicLogs, func(message queue.Message) {
		var log Log

		message.Decode(&log)

		f(log)
	})
}
