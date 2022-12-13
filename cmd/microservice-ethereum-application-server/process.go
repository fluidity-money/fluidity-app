// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package main

import (
	"testing"

	"github.com/fluidity-money/fluidity-app/common/ethereum/applications"
	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/queue"
	"github.com/fluidity-money/fluidity-app/lib/queues/worker"
	"github.com/fluidity-money/fluidity-app/lib/types/ethereum"
	libEthereum "github.com/fluidity-money/fluidity-app/common/ethereum"

	ethCommon "github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/ethclient"
)

// process an incoming message, branching on whether testing is enabled to use fake data
func process(t *testing.T, publishAmqpTopic string, contractAddress ethCommon.Address, gethClient *ethclient.Client, tokenDecimals int, applicationContracts []ethereum.Address) func(worker.EthereumBlockLog) {
	return func(blockLog worker.EthereumBlockLog) {
		var (
			logs         = blockLog.Logs
			transactions = blockLog.Transactions
			blockHash    = blockLog.BlockHash
		)

		fluidTransfers := libEthereum.GetTransfers(
			logs,
			transactions,
			blockHash,
			contractAddress,
		)

		applicationTransfers := libEthereum.GetApplicationTransfers(
			logs,
			transactions,
			blockHash,
			applicationContracts,
			applications.ClassifyApplicationLogTopic,
		)

		// fetch receipts and calc app fees for each application transfer
		// and group the transfers by transaction

		var blockTransactions = make(map[ethereum.Hash]ethereum.Transaction)

		for _, transaction := range blockLog.Transactions {
			hash := transaction.Hash

			blockTransactions[hash] = transaction
		}

		var decoratedTransactions = make(map[ethereum.Hash]worker.EthereumDecoratedTransaction)

		for transactionHash, transfers := range applicationTransfers {
			transaction, exists := blockTransactions[transactionHash]

			if !exists {
				log.Fatal(func(k *log.Log) {
					k.Format(
						"Transaction %s in block %s is unreferenced!",
						transactionHash.String(),
						blockLog.BlockHash,
					)
				})
			}

			convertedReceipt, err := getReceipt(gethClient, transactionHash)

			if err != nil {
				log.Fatal(func(k *log.Log) {
					k.Format(
						"Failed to fetch receipt for transaction %s!",
						transactionHash.String(),
					)

					k.Payload = err
				})
			}

			transfersWithFees := make([]worker.EthereumDecoratedTransfer, len(transfers))

			for i, transfer := range transfers {
				fee, emission, err := applications.GetApplicationFee(
					transfer,
					gethClient,
					contractAddress,
					tokenDecimals,
					*convertedReceipt,
				)

				if err != nil {
					log.Fatal(func(k *log.Log) {
						k.Message = "Failed to get the application fee for an application transfer!"
						k.Payload = err
					})
				}

				// nil, nil for a skipped event
				if fee == nil {
					log.App(func(k *log.Log) {
						k.Format(
							"Skipping an application transfer for transaction %#v and application %#v!",
							transactionHash.String(),
							transfer.Application,
						)
					})

					continue
				}

				decorator := &worker.EthereumWorkerDecorator{
					Application:    transfer.Application,
					ApplicationFee: fee,
				}

				toAddress, fromAddress, err := applications.GetApplicationTransferParties(
					transaction,
					transfer,
				)

				if err != nil {
					log.Fatal(func(k *log.Log) {
						k.Format(
							"Failed to get the sender and receiver for an application transfer with hash %s!",
							transactionHash.String(),
						)

						k.Payload = err
					})
				}

				decoratedTransfer := worker.EthereumDecoratedTransfer{
					TransactionHash:  transactionHash,
					SenderAddress:    fromAddress,
					RecipientAddress: toAddress,
					Decorator:        decorator,

					AppEmissions: emission,
				}

				transfersWithFees[i] = decoratedTransfer
			}

			decoratedTransactions[transactionHash] = worker.EthereumDecoratedTransaction{
				Transaction: transaction,
				Receipt:     *convertedReceipt,
				Transfers:   transfersWithFees,
			}
		}

		// add the non-app fluid transfers (and get their receipts)

		for _, fluidTransfer := range fluidTransfers {
			transactionHash := fluidTransfer.TransactionHash

			decoratedTransaction, exists := decoratedTransactions[transactionHash]

			if !exists {
				// find transaction, fetch receipt
				transaction, txExists := blockTransactions[transactionHash]

				if !txExists {
					log.Fatal(func(k *log.Log) {
						k.Format(
							"Transaction %s in block %s is unreferenced!",
							transactionHash.String(),
							blockLog.BlockHash,
						)
					})
				}

				decoratedTransaction.Transaction = transaction

				receipt, err := getReceipt(gethClient, transactionHash)

				if err != nil {
					log.Fatal(func(k *log.Log) {
						k.Format(
							"Failed to fetch receipt for transaction %s!",
							transactionHash.String(),
						)

						k.Payload = err
					})
				}

				decoratedTransaction.Receipt = *receipt
			}

			var (
				from = fluidTransfer.SenderAddress
				to   = fluidTransfer.RecipientAddress
			)

			transfer := worker.EthereumDecoratedTransfer{
				TransactionHash:  transactionHash,
				SenderAddress:    from,
				RecipientAddress: to,
				Decorator:        nil,
				AppEmissions:     worker.EthereumAppFees{},
			}

			decoratedTransaction.Transfers = append(decoratedTransaction.Transfers, transfer)

			decoratedTransactions[transactionHash] = decoratedTransaction
		}

		serverWork := worker.EthereumHintedBlock{
			BlockHash:             blockLog.BlockHash,
			BlockBaseFee:          blockLog.BlockBaseFee,
			BlockTime:             blockLog.BlockTime,
			BlockNumber:           blockLog.BlockNumber,
			DecoratedTransactions: decoratedTransactions,
		}

		// send to server

		queue.SendMessage(publishAmqpTopic, serverWork)
	}
}
