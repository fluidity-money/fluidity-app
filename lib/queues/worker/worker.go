package worker

// contains queue code specific to the current implementation of the worker

import (
	"github.com/fluidity-money/fluidity-app/lib/queue"
	"github.com/fluidity-money/fluidity-app/lib/types/worker"
)

const (
	TopicEthereumAnnouncements     = "worker.ethereum.announcements"
	TopicEthereumServerWork        = "worker.server.work"
	TopicEthereumApplicationEvents = "worker.ethereum.application.events"

	TopicEmissions = "worker.emissions"
)

type (
	EthereumAnnouncement        = worker.EthereumAnnouncement
	EthereumBlockLog            = worker.EthereumBlockLog
	EthereumServerWork          = worker.EthereumServerWork
	EthereumHintedBlock         = worker.EthereumHintedBlock
	EthereumDecoratedTransfer   = worker.EthereumDecoratedTransfer
	EthereumWorkerDecorator     = worker.EthereumWorkerDecorator
	EthereumApplicationEvent    = worker.EthereumApplicationEvent
	EthereumApplicationTransfer = worker.EthereumApplicationTransfer

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

func GetEthereumServerWork(f func(EthereumServerWork)) {
	queue.GetMessages(TopicEthereumServerWork, func(message queue.Message) {
		var serverWork EthereumServerWork

		message.Decode(&serverWork)

		f(serverWork)
	})
}

func EthereumApplicationEvents(f func(EthereumApplicationEvent)) {
	queue.GetMessages(TopicEthereumApplicationEvents, func(message queue.Message) {
		var ApplicationEvent EthereumApplicationEvent

		message.Decode(&ApplicationEvent)

		f(ApplicationEvent)
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
