// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package main

import (
	"context"
	"fmt"
	"strconv"
	"strings"

	libEthereum "github.com/fluidity-money/fluidity-app/common/ethereum"
	"github.com/fluidity-money/fluidity-app/common/ethereum/applications"
	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/queue"
	"github.com/fluidity-money/fluidity-app/lib/queues/worker"
	appTypes "github.com/fluidity-money/fluidity-app/lib/types/applications"
	"github.com/fluidity-money/fluidity-app/lib/types/ethereum"
	"github.com/fluidity-money/fluidity-app/lib/util"

	"github.com/ethereum/go-ethereum/common"
	ethCommon "github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/ethclient"
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

	// EnvServerWorkQueue to send serverwork down
	EnvServerWorkQueue = `FLU_ETHEREUM_WORK_QUEUE`
)

func getReceipt(gethClient *ethclient.Client, transactionHash ethereum.Hash) (*ethereum.Receipt, error) {
	txReceipt, err := gethClient.TransactionReceipt(
		context.Background(),
		common.HexToHash(transactionHash.String()),
	)

	if err != nil {
		return nil, fmt.Errorf(
			"Failed to get the transaction receipt for Fluid transfer %#v! %w",
			transactionHash.String(),
			err,
		)
	}

	if txReceipt == nil {
		return nil, fmt.Errorf(
			"Receipt for fluid transfer %v was nil! %w",
			transactionHash,
			err,
		)
	}

	convertedReceipt := libEthereum.ConvertGethReceipt(*txReceipt)

	return &convertedReceipt, nil
}

// appsListFromEnvOrFatal parses a list of `app:address:address,app:address:address` into a map of {address => app}
func appsListFromEnvOrFatal(key string) map[ethereum.Address]appTypes.Application {
	applicationContracts_ := util.GetEnvOrFatal(EnvApplicationContracts)

	apps := make(map[ethereum.Address]appTypes.Application)

	for _, appAddresses_ := range strings.Split(applicationContracts_, ",") {
		appAddresses := strings.Split(appAddresses_, ":")

		if len(appAddresses) < 2 {
			log.Fatal(func(k *log.Log) {
				k.Format(
					"Malformed app address line '%s'!",
					appAddresses_,
				)
			})
		}

		app, err := appTypes.ParseApplicationName(appAddresses[0])

		if err != nil {
			log.Fatal(func(k *log.Log) {
				k.Format(
					"Failed to parse an etherem application from name '%s'! %v",
					appAddresses[0],
					err,
				)
			})
		}

		for _, address_ := range appAddresses[1:] {
			address := ethereum.AddressFromString(address_)

			apps[address] = app
		}
	}

	return apps
}

func main() {
	var (
		publishAmqpTopic         = util.GetEnvOrFatal(EnvServerWorkQueue)
		contractAddrString       = util.GetEnvOrFatal(EnvContractAddress)
		gethHttpUrl              = util.GetEnvOrFatal(EnvEthereumHttpUrl)
		underlyingTokenDecimals_ = util.GetEnvOrFatal(EnvUnderlyingTokenDecimals)
		applicationContracts     = appsListFromEnvOrFatal(EnvApplicationContracts)
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

		if err != nil {
			log.Fatal(func(k *log.Log) {
				k.Format(
					"Failed to get a fluid transfer in block %#v!",
					blockHash,
				)

				k.Payload = err
			})
		}

		applicationTransfers := libEthereum.GetApplicationTransfers(
			logs,
			transactions,
			blockHash,
			applicationContracts,
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

			transfersWithFees := make([]worker.EthereumDecoratedTransfer, 0)

			for _, transfer := range transfers {
				fee, utility, emission, err := applications.GetApplicationFee(
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
					Utility:        utility,
				}

				sender, recipient, err := applications.GetApplicationTransferParties(
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
					SenderAddress:    sender,
					RecipientAddress: recipient,
					Decorator:        decorator,
					AppEmissions:     emission,
				}

				transfersWithFees = append(transfersWithFees, decoratedTransfer)
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
	})
}
