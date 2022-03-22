package worker

// contains queue code specific to the current implementation of the worker

import (
	"github.com/fluidity-money/fluidity-app/lib/queue"
	"github.com/fluidity-money/fluidity-app/lib/types/worker"
)

const (
	TopicAnnouncements = "worker.announcements"
	TopicBlockLogs     = "worker.blocks"
)

type (
	EthereumAnnouncement = worker.EthereumAnnouncement
	EthereumBlockLog     = worker.EthereumBlockLog
)

func Announcements(f func(EthereumAnnouncement)) {
	queue.GetMessages(TopicAnnouncements, func(message queue.Message) {

		var announcement EthereumAnnouncement

		message.Decode(&announcement)

		f(announcement)
	})
}

func BlockLogs(f func(EthereumBlockLog)) {
	queue.GetMessages(TopicBlockLogs, func(message queue.Message) {
		var blockLog EthereumBlockLog

		message.Decode(&blockLog)

		f(blockLog)
	})
}
