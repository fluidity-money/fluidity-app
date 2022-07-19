package solana

import (
	"github.com/fluidity-money/fluidity-app/lib/queue"
	"github.com/fluidity-money/fluidity-app/lib/types/solana"
	"github.com/fluidity-money/fluidity-app/lib/types/worker"
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

	BufferedTransactionLog          = solana.BufferedTransactionLog
	BufferedTransaction             = solana.BufferedTransaction
	BufferedApplicationTransactions = worker.SolanaBufferedApplicationTransactions
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

func BufferedTransactions(f func(BufferedApplicationTransactions)) {
	queue.GetMessages(TopicBufferedTransactions, func(message queue.Message) {
		var bufferedTransaction BufferedApplicationTransactions

		message.Decode(&bufferedTransaction)

		f(bufferedTransaction)
	})
}
