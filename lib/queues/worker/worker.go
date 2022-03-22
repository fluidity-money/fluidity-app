package worker

// contains queue code specific to the current implementation of the worker

import (
	"github.com/fluidity-money/fluidity-app/lib/queue"
	"github.com/fluidity-money/fluidity-app/lib/types/worker"
)

const (
	TopicEthereumAnnouncements = "worker.ethereum.announcements"
	TopicEthereumBlockLogs     = "worker.ethereum.blocks"
)

type (
	EthereumAnnouncement = worker.EthereumAnnouncement
	EthereumBlockLog     = worker.EthereumBlockLog
)

func Announcements(f func(EthereumAnnouncement)) {
	queue.GetMessages(TopicEthereumAnnouncements, func(message queue.Message) {

		var announcement EthereumAnnouncement

		message.Decode(&announcement)

		f(announcement)
	})
}

func EthereumBlockLogs(f func(EthereumBlockLog)) {
	queue.GetMessages(TopicEthereumBlockLogs, func(message queue.Message) {
		var blockLog EthereumBlockLog

		message.Decode(&blockLog)

		f(blockLog)
	})
}
