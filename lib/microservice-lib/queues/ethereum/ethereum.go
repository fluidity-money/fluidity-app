package ethereum

// ethereum contains queue code that receives blocks, transactions and
// receipts from upstream, safely decoding it appropriately. Intended
// to be used with a fanout exchange, so topic names are randomly chosen.

import "github.com/fluidity-money/fluidity-app/lib/queue"

const (
	// TopicBlocks follow to get every block published on the network
	TopicBlocks = "ethereum.block"

	// TopicTransactions follow to get every transaction seen
	TopicTransactions = "ethereum.transaction"

	// TopicBlockHeaders follow to get every block header seen
	TopicBlockHeaders = "ethereum.block.header"

	// TopicBlockBodies follow to get every block body
	TopicBlockBodies = "ethereum.block.body"

	// TopicLogs follow to get every contract log that's confirmed
	TopicLogs = "ethereum.log"

	// TopicUnconfirmedLogs to use for tracking logs that haven't been confirmed
	// according to what Ethereum considers secure.
	TopicUnconfirmedLogs = "ethereum.unconfirmed.logs"
)

func Blocks(f func(Block)) {
	queue.GetMessages(TopicBlocks, func(message queue.Message) {
		var	block Block

		message.Decode(&block)

		f(block)
	})
}

func Transactions(f func(Transaction)) {
	queue.GetMessages(TopicTransactions, func(message queue.Message) {
		var	transaction Transaction

		message.Decode(&transaction)

		f(transaction)
	})
}

func BlockHeaders(f func(BlockHeader)) {
	queue.GetMessages(TopicBlockHeaders, func(message queue.Message) {
		var	header BlockHeader

		message.Decode(&header)

		f(header)
	})
}

func BlockBodies(f func(BlockBody)) {
	queue.GetMessages(TopicBlockBodies, func(message queue.Message) {
		var	body BlockBody

		message.Decode(&body)

		f(body)
	})
}

func Logs(f func(Log)) {
	queue.GetMessages(TopicLogs, func(message queue.Message) {
		var	log Log

		message.Decode(&log)

		f(log)
	})
}
