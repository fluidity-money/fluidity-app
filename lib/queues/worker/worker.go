// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package worker

// contains queue code specific to the current implementation of the worker

import (
	"github.com/fluidity-money/fluidity-app/lib/queue"
	"github.com/fluidity-money/fluidity-app/lib/types/worker"
)

const (
	TopicEthereumAnnouncements     = "worker.ethereum.announcements"
	TopicEthereumBlockLogs         = "worker.ethereum.blocks" // into apps server
	TopicEthereumServerWork        = "worker.server.work" // into worker

	TopicSolanaParsedTransactions = "worker.solana.parsed_transactions"
	TopicSolanaBufferedTransfers  = "worker.solana.buffered_transfers"
	TopicSolanaServerWork         = "worker.solana.server.work"

	TopicEmissions = "worker.emissions"
)

type (
	EthereumAnnouncement         = worker.EthereumAnnouncement
	EthereumBlockLog             = worker.EthereumBlockLog
	EthereumHintedBlock          = worker.EthereumHintedBlock
	EthereumDecoratedTransfer    = worker.EthereumDecoratedTransfer
	EthereumDecoratedTransaction = worker.EthereumDecoratedTransaction
	EthereumWorkerDecorator      = worker.EthereumWorkerDecorator
	EthereumApplicationEvent     = worker.EthereumApplicationEvent
	EthereumApplicationTransfer  = worker.EthereumApplicationTransfer

	SolanaParsedTransaction          = worker.SolanaParsedTransaction
	SolanaBufferedParsedTransactions = worker.SolanaBufferedParsedTransactions
	SolanaDecoratedTransfer          = worker.SolanaDecoratedTransfer
	SolanaBufferedTransfers          = worker.SolanaBufferedTransfers
	SolanaWork                       = worker.SolanaWork
	SolanaWinnerAnnouncement         = worker.SolanaWinnerAnnouncement

	Emission        = worker.Emission
	EthereumAppFees = worker.EthereumAppFees
	SolanaAppFees   = worker.SolanaAppFees
)

func EthereumAnnouncements(f func(EthereumAnnouncement)) {
	queue.GetMessages(TopicEthereumAnnouncements, func(message queue.Message) {

		var announcement EthereumAnnouncement

		message.Decode(&announcement)

		f(announcement)
	})
}

func GetEthereumBlockLogs(f func(EthereumBlockLog)) {
	queue.GetMessages(TopicEthereumBlockLogs, func(message queue.Message) {
		var blockLog EthereumBlockLog

		message.Decode(&blockLog)

		f(blockLog)
	})
}

func GetEthereumHintedBlocks(f func(EthereumHintedBlock)) {
	queue.GetMessages(TopicEthereumServerWork, func(message queue.Message) {
		var hintedBlock EthereumHintedBlock

		message.Decode(&hintedBlock)

		f(hintedBlock)
	})
}

func GetSolanaBufferedParsedTransactions(f func(SolanaBufferedParsedTransactions)) {
	queue.GetMessages(TopicSolanaParsedTransactions, func(message queue.Message) {
		var transactions SolanaBufferedParsedTransactions

		message.Decode(&transactions)

		f(transactions)
	})
}

func GetSolanaBufferedTransfers(f func(SolanaBufferedTransfers)) {
	queue.GetMessages(TopicSolanaBufferedTransfers, func(message queue.Message) {
		var transfers SolanaBufferedTransfers

		message.Decode(&transfers)

		f(transfers)
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

func NewSolanaEmission() *Emission {
	return worker.NewSolanaEmission()
}
