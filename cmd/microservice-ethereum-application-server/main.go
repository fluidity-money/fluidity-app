// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package main

import (
	"strconv"
	"strings"

	ethCommon "github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/ethclient"
	libEthereum "github.com/fluidity-money/fluidity-app/common/ethereum"
	"github.com/fluidity-money/fluidity-app/common/ethereum/applications"
	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/queue"
	"github.com/fluidity-money/fluidity-app/lib/queues/worker"
	"github.com/fluidity-money/fluidity-app/lib/util"
)

const (
	// EnvContractAddress is the Fluid token contract
	EnvContractAddress = `FLU_ETHEREUM_CONTRACT_ADDR`

	// EnvEthereumWsUrl is the url to use to connect to the WS Geth endpoint
	EnvEthereumHttpUrl = `FLU_ETHEREUM_HTTP_URL`

	// EnvUnderlyingTokenDecimals supported by the contract
	EnvUnderlyingTokenDecimals = `FLU_ETHEREUM_UNDERLYING_TOKEN_DECIMALS`

	// EnvApplicationContracts to list the application contracts to monitor
	EnvApplicationContracts = `FLU_ETHEREUM_APPLICATION_CONTRACTS`
)

func main() {
	var (
		contractAddrString       = util.GetEnvOrFatal(EnvContractAddress)
		gethHttpUrl              = util.GetEnvOrFatal(EnvEthereumHttpUrl)
		underlyingTokenDecimals_ = util.GetEnvOrFatal(EnvUnderlyingTokenDecimals)
		applicationContracts_    = util.GetEnvOrFatal(EnvApplicationContracts)
	)

	contractAddress := ethCommon.HexToAddress(contractAddrString)
	tokenDecimals, err := strconv.Atoi(underlyingTokenDecimals_)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Format(
				"Underlying token decimals %#v is a malformed int!",
				underlyingTokenDecimals_,
			)

			k.Payload = err
		})
	}

	var applicationContracts []string

	for _, address := range strings.Split(applicationContracts_, ",") {
		applicationContracts = append(applicationContracts, address)
	}

	gethClient, err := ethclient.Dial(gethHttpUrl)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Message = "Failed to connect to Geth Websocket!"
			k.Payload = err
		})
	}

	defer gethClient.Close()

	worker.GetEthereumBlockLogs(func(blockLog worker.EthereumBlockLog) {

		var (
			logs = blockLog.Logs
			transactions = blockLog.Transactions
			blockHash = blockLog.BlockHash
		)

		fluidTransfers, err := libEthereum.GetTransfers(
			logs,
			transactions,
			blockHash,
			contractAddress,
		)

		if err != nil {
			log.Fatal(func(k *log.Log) {
				k.Format(
					"Failed to get a fluid transfer in block %#v!",
					blockHash,
				)
				k.Payload = err
			})
		}

		// handle sending to application server
		applicationTransfers, err := libEthereum.GetApplicationTransfers(
			logs,
			transactions,
			blockHash,
			applicationContracts,
			applications.ClassifyApplicationLogTopic,
		)

		if err != nil {
			log.Fatal(func(k *log.Log) {
				k.Format(
					"Failed to get application events in block %#v!",
					blockHash,
				)
				k.Payload = err
			})
		}

		decoratedTransfers := make([]worker.EthereumDecoratedTransfer, len(fluidTransfers))

		// add the non-app fluid transfers
		for i, fluidTransfer := range fluidTransfers {
			decoratedTransfers[i] = fluidTransfer
		}

		// loop over application events in the block, add payouts as decorator
		for i, transfer := range applicationTransfers {

			fee, err := applications.GetApplicationFee(transfer, gethClient, contractAddress, tokenDecimals)

			if err != nil {
				log.Fatal(func(k *log.Log) {
					k.Message = "Failed to get the application fee for an application transfer!"
					k.Payload = err
				})
			}

			var decorator *worker.EthereumWorkerDecorator

			// nil, nil for a skipped event
			if fee != nil {
				decorator = &worker.EthereumWorkerDecorator{
					ApplicationFee: fee,
				}
			}

			toAddress, fromAddress, err := applications.GetApplicationTransferParties(transfer)

			if err != nil {
				log.Fatal(func(k *log.Log) {
					k.Message = "Failed to get the sender and receiver for an application transfer!"
					k.Payload = err
				})
			}

			decoratedTransfer := worker.EthereumDecoratedTransfer{
				SenderAddress:    fromAddress,
				RecipientAddress: toAddress,
				Decorator:        decorator,
				Transaction:      transfer.Transaction,
			}

			decoratedTransfers[i] = decoratedTransfer
		}

		serverWork := worker.EthereumHintedBlock{
			BlockHash:          blockLog.BlockHash,
			BlockBaseFee:       blockLog.BlockBaseFee,
			BlockTime:          blockLog.BlockTime,
			BlockNumber:        blockLog.BlockNumber,
			DecoratedTransfers: decoratedTransfers,
		}

		// send to server
		queue.SendMessage(worker.TopicEthereumServerWork, serverWork)
	})
}
