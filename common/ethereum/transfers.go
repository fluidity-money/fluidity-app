// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package ethereum

import (
	"strings"

	ethCommon "github.com/ethereum/go-ethereum/common"
	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/types/applications"
	"github.com/fluidity-money/fluidity-app/lib/types/ethereum"
	"github.com/fluidity-money/fluidity-app/lib/types/worker"
)

var TransferLogTopic = strings.ToLower(
	"0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
)

// shouldIgnoreTransfer to tell if we should ignore a transfer
func shouldIgnoreTransfer(from ethereum.Address, to ethereum.Address) bool {
	if from == ethereum.ZeroAddress {
		return true
	}

	if to == ethereum.ZeroAddress {
		return true
	}

	return false
}

// Get transfer receipts
func GetTransfers(logs []ethereum.Log, transactions []ethereum.Transaction, blockHash ethereum.Hash, fluidContractAddress ethCommon.Address, utilities map[ethereum.Address]applications.UtilityName) []worker.EthereumDecoratedTransfer {
	var (
		contractAddress        = fluidContractAddress.String()
		loweredContractAddress = strings.ToLower(contractAddress)
	)

	transfers := make([]worker.EthereumDecoratedTransfer, 0)

	for _, transferLog := range logs {
		transactionHash := transferLog.TxHash

		var (
			transferContractAddress_ = transferLog.Address.String()
			topics                   = transferLog.Topics
			logIndex                 = transferLog.Index
		)

		transferContractAddress := strings.ToLower(transferContractAddress_)

		if transferContractAddress != loweredContractAddress {
			log.Debugf(
				"For transaction hash %#v, contract was %#v, not %#v!",
				transactionHash,
				transferContractAddress,
				fluidContractAddress,
			)

			continue
		}

		firstTopic := strings.ToLower(topics[0].String())

		if !IsTransferLogTopic(firstTopic) {
			log.Debugf(
				"For transaction hash %#v, first topic %#v != transfer log topic %#v!",
				transactionHash,
				firstTopic,
				TransferLogTopic,
			)

			continue
		}

		if len(topics) != 3 {
			log.Debugf(
				"Number of topics for transaction hash %#v, topic content %#v length != 3!",
				transactionHash,
				topics,
			)

			continue
		}

		var (
			fromAddress_ = topics[1].String()
			toAddress_   = topics[2].String()

			fromTruncated = ethCommon.HexToAddress(fromAddress_)
			toTruncated   = ethCommon.HexToAddress(toAddress_)

			fromAddress = ConvertGethAddress(fromTruncated)
			toAddress   = ConvertGethAddress(toTruncated)
		)

		if shouldIgnoreTransfer(fromAddress, toAddress) {
			log.Debugf(
				"Ignoring transaction involving the zero address %s from %s to %s",
				transactionHash,
				fromAddress.String(),
				toAddress.String(),
			)

			continue
		}

		var decorator *worker.EthereumWorkerDecorator

		utility, exists := utilities[ethereum.AddressFromString(transferContractAddress)]

		if exists {
			decorator = &worker.EthereumWorkerDecorator{
				UtilityName: utility,
			}
		}

		transfer := worker.EthereumDecoratedTransfer{
			SenderAddress:    fromAddress,
			RecipientAddress: toAddress,
			TransactionHash:  transactionHash,
			LogIndex:         &logIndex,
			Decorator:        decorator,
		}

		transfers = append(transfers, transfer)
	}

	return transfers
}

// GetApplicationTransfers to use the passed function to classify
// individual logs and their respective transactions as generated by
// an application we support, to be processed later
func GetApplicationTransfers(logs []ethereum.Log, transactions []ethereum.Transaction, blockHash ethereum.Hash, applicationContracts map[ethereum.Address]applications.Application) map[ethereum.Hash][]worker.EthereumApplicationTransfer {
	transfers := make(map[ethereum.Hash][]worker.EthereumApplicationTransfer)

	for _, transferLog := range logs {
		transactionHash := transferLog.TxHash

		var (
			transferContract = transferLog.Address
			topics           = transferLog.Topics
			index            = transferLog.Index
		)

		app, found := applicationContracts[transferContract]

		if !found {
			log.Debugf(
				"For transaction hash %#v, index %v, contract %v was not an app contract!",
				transactionHash,
				index.String(),
				transferContract,
			)

			continue
		}

		if len(topics) == 0 {
			log.Debugf(
				"For transaction hash %#v, index %v, no topics were found!",
				index.String(),
				transactionHash,
			)

			continue
		}

		transfer := worker.EthereumApplicationTransfer{
			TransactionHash: transactionHash,
			Log:             transferLog,
			Application:     app,
		}

		transfers[transactionHash] = append(transfers[transactionHash], transfer)
	}

	return transfers
}

// IsTransferLogTopic returns whether given string matches signature of
// the fluid transfer ABI
func IsTransferLogTopic(topic string) bool {
	return topic == TransferLogTopic
}
