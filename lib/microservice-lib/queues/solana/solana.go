package solana

import (
	"github.com/fluidity-money/fluidity-app/lib/queue"
	"github.com/fluidity-money/fluidity-app/lib/types/solana"
)

const (
	TopicSlots = `solana.slot`

	TopicBufferedTransactionLogs = `solana.buffered.logs`
	TopicBufferedTransactions    = `solana.buffered.transaction`
)

type (
	Slot = solana.Slot

	TransactionLog = solana.TransactionLog
	Transaction    = solana.Transaction

	BufferedTransactionLog = solana.BufferedTransactionLog
	BufferedTransaction    = solana.BufferedTransaction
)

func Slots(f func(Slot)) {
	queue.GetMessages(TopicSlots, func(message queue.Message) {
		var log Slot

		message.Decode(&log)

		f(log)
	})
}

func BufferedTransactionLogs(f func(BufferedTransactionLog)) {
	queue.GetMessages(TopicBufferedTransactionLogs, func(message queue.Message) {
		var bufferedTransactionLogs BufferedTransactionLog

		message.Decode(&bufferedTransactionLogs)

		f(bufferedTransactionLogs)
	})
}

func BufferedTransactions(f func(BufferedTransaction)) {
	queue.GetMessages(TopicBufferedTransactions, func(message queue.Message) {
		var bufferedTransaction BufferedTransaction

		message.Decode(&bufferedTransaction)

		f(bufferedTransaction)
	})
}
