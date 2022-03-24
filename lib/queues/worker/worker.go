package worker

// contains queue code specific to the current implementation of the worker

import (
	"github.com/fluidity-money/fluidity-app/lib/queue"
	"github.com/fluidity-money/fluidity-app/lib/types/worker"
)

const (
	TopicEthereumAnnouncements = "worker.ethereum.announcements"
	TopicEthereumBlockLogs     = "worker.ethereum.blocks"

	TopicEmissions = "worker.emissions"
)

type (
	EthereumAnnouncement = worker.EthereumAnnouncement
	EthereumBlockLog     = worker.EthereumBlockLog

	SolanaWinnerAnnouncement = worker.SolanaWinnerAnnouncement

	Emission = worker.Emission
)

func EthereumAnnouncements(f func(EthereumAnnouncement)) {
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

func Emissions(f func(Emission)) {
	queue.GetMessages(TopicEmissions, func(message queue.Message) {
		var emission Emission

		message.Decode(&emission)

		f(emission)
	})
}

func NewEthereumEmission() *Emission {
	return worker.NewEthereumEmission()
}

func NewSolanaEmisison() *Emission {
	return worker.NewSolanaEmission()
}
