// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package main

//

import (
	"math"
	"math/big"
	"strconv"

	libEthereum "github.com/fluidity-money/fluidity-app/common/ethereum"
	"github.com/fluidity-money/fluidity-app/common/ethereum/applications"
	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/queue"
	user_actions "github.com/fluidity-money/fluidity-app/lib/queues/user-actions"
	"github.com/fluidity-money/fluidity-app/lib/queues/worker"
	"github.com/fluidity-money/fluidity-app/lib/types/ethereum"
	"github.com/fluidity-money/fluidity-app/lib/types/misc"
	"github.com/fluidity-money/fluidity-app/lib/types/network"
	"github.com/fluidity-money/fluidity-app/lib/util"

	ethCommon "github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/ethclient"
)

const (
	// EnvContractAddress is the Fluid token contract
	EnvContractAddress = `FLU_ETHEREUM_CONTRACT_ADDR`

	// EnvEthereumWsUrl is the url to use to connect to the WS Geth endpoint
	EnvEthereumHttpUrl = `FLU_ETHEREUM_HTTP_URL`

	// EnvUnderlyingTokenName is used to identify token in user actions
	EnvUnderlyingTokenName = `FLU_ETHEREUM_UNDERLYING_TOKEN_NAME`

	// EnvUnderlyingTokenDecimals supported by the contract
	EnvUnderlyingTokenDecimals = `FLU_ETHEREUM_UNDERLYING_TOKEN_DECIMALS`

	// EnvApplicationContracts to list the application contracts to monitor
	EnvApplicationContracts = `FLU_ETHEREUM_APPLICATION_CONTRACTS`

	// EnvUtilityContracts to list the utility contracts to monitor and tag transactions
	EnvUtilityContracts = `FLU_ETHEREUM_UTILITY_CONTRACTS`

	// EnvServerWorkQueue to send serverwork down
	EnvServerWorkQueue = `FLU_ETHEREUM_WORK_QUEUE`

	// EnvNetwork is the network ID, used to create user actions
	EnvNetwork = `FLU_ETHEREUM_NETWORK`
)

func main() {
	var (
		publishAmqpTopic         = util.GetEnvOrFatal(EnvServerWorkQueue)
		contractAddrString       = util.GetEnvOrFatal(EnvContractAddress)
		gethHttpUrl              = util.PickEnvOrFatal(EnvEthereumHttpUrl)
		tokenName                = util.GetEnvOrFatal(EnvUnderlyingTokenName)
		underlyingTokenDecimals_ = util.GetEnvOrFatal(EnvUnderlyingTokenDecimals)
		applicationContracts     = applications.AppsListFromEnvOrFatal(EnvApplicationContracts)
		utilities                = applications.UtilityListFromEnvOrFatal(EnvUtilityContracts)
		networkId                = util.GetEnvOrFatal(EnvNetwork)
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

	dbNetwork, err := network.ParseEthereumNetwork(networkId)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Message = "Failed to parse network from env"
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
			utilities,
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

			convertedReceipt, err := libEthereum.GetReceipt(gethClient, transactionHash)

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
				feeData, emission, err := applications.GetApplicationFee(
					transfer,
					gethClient,
					contractAddress,
					tokenDecimals,
					*convertedReceipt,
					transaction.Data,
				)

				var (
					fee    = feeData.Fee
					volume = feeData.Volume
				)

				if err != nil {
					log.Fatal(func(k *log.Log) {
						k.Message = "Failed to get the application fee for an application transfer!"
						k.Payload = err
					})
				}

				normalisedAddress := ethereum.AddressFromString(transfer.Log.Address.String())

				utility, _ := utilities[normalisedAddress]

				// we set the decorator if there's an app fee
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
					UtilityName:    utility,
					ApplicationFee: fee,
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

				indexCopy := new(misc.BigInt)
				indexCopy.Set(&transfer.Log.Index.Int)

				decoratedTransfer := worker.EthereumDecoratedTransfer{
					TransactionHash:  transactionHash,
					SenderAddress:    sender,
					LogIndex:         indexCopy,
					RecipientAddress: recipient,
					Decorator:        decorator,
					AppEmissions:     emission,
				}

				transfersWithFees = append(transfersWithFees, decoratedTransfer)

				// don't emit mint/burn user actions
				if sender == ethereum.ZeroAddress || recipient == ethereum.ZeroAddress {
					continue
				}	

				decimalsAdjusted := math.Pow10(tokenDecimals)
				decimalsRat := new(big.Rat).SetFloat64(decimalsAdjusted)

				// adjust volume then convert to a big int
				// no loss of precision as there won't be more decimals than tokenDecimals
				volume = volume.Mul(volume, decimalsRat)
				volumeAdjusted_, _ := new(big.Int).SetString(volume.FloatString(0), 0)
				volumeAdjusted := misc.NewBigIntFromInt(*volumeAdjusted_)

				transferUserAction := user_actions.NewSendEthereum(
					dbNetwork,
					sender,
					recipient,
					transactionHash,
					volumeAdjusted,
					tokenName,
					tokenDecimals,
					*indexCopy,
					decorator.Application,
				)

				queue.SendMessage(
					user_actions.TopicUserActionsEthereum,
					transferUserAction,
				)
			}

			decoratedTransactions[transactionHash] = worker.EthereumDecoratedTransaction{
				Transaction: transaction,
				Receipt:     *convertedReceipt,
				Transfers:   transfersWithFees,
			}
		}

		// add the non-app fluid transfers (and get their receipts)

		for _, fluidTransfer := range fluidTransfers {
			var (
				from            = fluidTransfer.SenderAddress
				to              = fluidTransfer.RecipientAddress
				decorator       = fluidTransfer.Decorator
				logIndex        = fluidTransfer.LogIndex
				transactionHash = fluidTransfer.TransactionHash
			)

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

				receipt, err := libEthereum.GetReceipt(gethClient, transactionHash)

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
			} else {
				// fill in decorator with app
				transfers := decoratedTransaction.Transfers

				if len(transfers) > 0 {
					app := transfers[0].Decorator.Application
					decorator.Application = app
				}
			}

			transfer := worker.EthereumDecoratedTransfer{
				TransactionHash:  transactionHash,
				SenderAddress:    from,
				RecipientAddress: to,
				LogIndex:         logIndex,
				Decorator:        decorator,
				AppEmissions:     worker.EthereumAppFees{},
			}

			decoratedTransaction.Transfers = append(decoratedTransaction.Transfers, transfer)

			decoratedTransactions[transactionHash] = decoratedTransaction

			// don't emit mint/burn user actions
			if from == ethereum.ZeroAddress || to == ethereum.ZeroAddress {
				continue
			}

			transferUserAction := user_actions.NewSendEthereum(
				dbNetwork,
				from,
				to,
				transactionHash,
				misc.NewBigIntFromInt(*decorator.Volume),
				tokenName,
				tokenDecimals,
				*logIndex,
				decorator.Application,
			)

			queue.SendMessage(
				user_actions.TopicUserActionsEthereum,
				transferUserAction,
			)

		}

		serverWork := worker.EthereumHintedBlock{
			BlockHash:             blockLog.BlockHash,
			BlockBaseFee:          blockLog.BlockBaseFee,
			BlockTime:             blockLog.BlockTime,
			BlockNumber:           blockLog.BlockNumber,
			DecoratedTransactions: decoratedTransactions,
		}

		for transactionHash, decoratedTransaction := range decoratedTransactions {
			for _, transfer := range decoratedTransaction.Transfers {
				if transfer.Decorator != nil {
					fee := "nil"

					if transfer.Decorator.ApplicationFee != nil {
						fee = transfer.Decorator.ApplicationFee.RatString()
					}

					log.Debug(func(k *log.Log) {
						k.Format(
							"For transaction hash %v, transfer with index %v had application %v, utility %v, fee %v!",
							transactionHash,
							transfer.LogIndex.String(),
							transfer.Decorator.Application.String(),
							transfer.Decorator.UtilityName,
							fee,
						)
					})
				}
			}
		}

		// send to server
		queue.SendMessage(publishAmqpTopic, serverWork)
	})
}
