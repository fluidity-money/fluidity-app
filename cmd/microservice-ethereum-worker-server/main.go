// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package main

import (
	"math/big"
	"strconv"

	ethTypes "github.com/ethereum/go-ethereum/core/types"
	"github.com/ethereum/go-ethereum/ethclient"

	"github.com/fluidity-money/fluidity-app/common/calculation/probability"
	"github.com/fluidity-money/fluidity-app/common/ethereum/applications"
	"github.com/fluidity-money/fluidity-app/common/ethereum/chainlink"
	"github.com/fluidity-money/fluidity-app/common/ethereum/fluidity"

	workerDb "github.com/fluidity-money/fluidity-app/lib/databases/postgres/worker"
	worker_config "github.com/fluidity-money/fluidity-app/lib/databases/postgres/worker"
	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/queue"
	"github.com/fluidity-money/fluidity-app/lib/queues/worker"
	appTypes "github.com/fluidity-money/fluidity-app/lib/types/applications"
	"github.com/fluidity-money/fluidity-app/lib/types/network"
	token_details "github.com/fluidity-money/fluidity-app/lib/types/token-details"
	workerTypes "github.com/fluidity-money/fluidity-app/lib/types/worker"
	"github.com/fluidity-money/fluidity-app/lib/util"
)

const (
	// SecondsInOneYear to use for ATX calculation
	SecondsInOneYear uint64 = 365 * 24 * 60 * 60

	// EthereumDecimals to normalise values to
	EthereumDecimals int64 = 1e18
)

const (
	// EnvContractAddress to use to find the Fluid contract to identify transfers
	EnvContractAddress = `FLU_ETHEREUM_CONTRACT_ADDR`

	// EnvRegistryAddress to query to get utility info
	EnvRegistryAddress = `FLU_ETHEREUM_REGISTRY_ADDR`

	// EnvEthereumHttpUrl to use to get information on the apy and atx from chainlink
	EnvEthereumHttpUrl = `FLU_ETHEREUM_HTTP_URL`

	// EnvChainlinkEthPriceFeed to get the price of eth in usd from
	EnvChainlinkEthPriceFeed = `FLU_ETHEREUM_CHAINLINK_ETH_FEED_ADDR`

	// EnvUnderlyingTokenName to be mindful of when doing price conversions to USDT
	EnvUnderlyingTokenName = `FLU_ETHEREUM_UNDERLYING_TOKEN_NAME`

	// EnvUnderlyingTokenDecimals to use when normalising the returned value
	// when converting to USDT
	EnvUnderlyingTokenDecimals = `FLU_ETHEREUM_UNDERLYING_TOKEN_DECIMALS`

	// EnvPublishAmqpQueue name to use when sending server-tracked transfers
	// to the client
	EnvPublishAmqpQueueName = `FLU_ETHEREUM_AMQP_QUEUE_NAME`

	// EnvServerWorkQueue to receive serverwork from
	EnvServerWorkQueue = `FLU_ETHEREUM_WORK_QUEUE`

	// EnvNetwork to differentiate between eth, arbitrum, etc
	EnvNetwork = `FLU_ETHEREUM_NETWORK`
)

type PayoutDetails struct {
	randomSource     []uint32
	randomPayouts    map[appTypes.UtilityName][]workerTypes.Payout
	customPayoutType workerTypes.CalculationType
}

func calculateSpecialPayoutDetails(dbNetwork network.BlockchainNetwork, pool workerTypes.UtilityVars, transferFeeNormal, currentAtx, payoutFreq *big.Rat, winningClasses, btx int, epochTime uint64, emission *worker.Emission) PayoutDetails {
	calculationType := pool.CalculationType

	switch calculationType {
	case workerTypes.CalculationTypeWorkerOverrides:
		var (
			// defaults
			winningClasses = winningClasses
			payoutFreq     = payoutFreq

			zeroRat = big.NewRat(0, 1)
		)

		// get overrides
		details, found := workerDb.GetSpecialPoolOverrides(dbNetwork, pool.Name)

		if found {
			var (
				winningClassesOverride = details.WinningClassesOverride
				payoutFreqOverride     = details.PayoutFreqOverride
				deltaWeightOverride    = details.DeltaWeightOverride
			)

			if winningClassesOverride != 0 {
				winningClasses = winningClassesOverride
			}
			if payoutFreqOverride != nil && payoutFreqOverride.Cmp(zeroRat) != 0 {
				payoutFreq.Set(payoutFreqOverride)
			}
			if deltaWeightOverride != nil && deltaWeightOverride.Cmp(zeroRat) != 0 {
				// this overrides a pool variable !!
				pool.DeltaWeight.Set(deltaWeightOverride)
			}
		}

		// call the trf normally now
		specialPayout := calculatePayoutDetails(
			workerTypes.TrfModeNoOptimisticSolution,
			transferFeeNormal,
			currentAtx,
			payoutFreq,
			[]workerTypes.UtilityVars{pool},
			winningClasses,
			btx,
			epochTime,
			emission,
		)

		specialPayout.customPayoutType = calculationType

		return specialPayout

	default:
		log.Fatal(func(k *log.Log) {
			k.Format(
				"Unhandled calculation type '%s'!",
				calculationType,
			)
		})

		panic("unreachable")
	}
}

// calculatePayoutDetails takes everything relevant to the trf and returns a list of payouts and balls
func calculatePayoutDetails(trfMode workerTypes.TrfMode, transferFeeNormal, currentAtx, payoutFreq *big.Rat, pools []workerTypes.UtilityVars, winningClasses, btx int, epochTime uint64, emission *worker.Emission) PayoutDetails {
	randomN, randomPayouts, _ := probability.WinningChances(
		trfMode,
		transferFeeNormal,
		currentAtx,
		payoutFreq,
		pools,
		winningClasses,
		btx,
		epochTime,
		emission,
	)

	randomSource := util.RandomIntegers(
		winningClasses,
		1,
		uint32(randomN),
	)

	payoutDetails := PayoutDetails{
		randomSource:  randomSource,
		randomPayouts: randomPayouts,
	}

	return payoutDetails
}

func main() {
	var (
		serverWorkAmqpTopic      = util.GetEnvOrFatal(EnvServerWorkQueue)
		contractAddress          = mustEthereumAddressFromEnv(EnvContractAddress)
		registryAddress          = mustEthereumAddressFromEnv(EnvRegistryAddress)
		chainlinkEthPriceFeed    = mustEthereumAddressFromEnv(EnvChainlinkEthPriceFeed)
		tokenName                = util.GetEnvOrFatal(EnvUnderlyingTokenName)
		underlyingTokenDecimals_ = util.GetEnvOrFatal(EnvUnderlyingTokenDecimals)
		publishAmqpQueueName     = util.GetEnvOrFatal(EnvPublishAmqpQueueName)
		ethereumUrl              = util.PickEnvOrFatal(EnvEthereumHttpUrl)
		networkId                = util.GetEnvOrFatal(EnvNetwork)

		dbNetwork network.BlockchainNetwork
	)

	dbNetwork, err := network.ParseEthereumNetwork(networkId)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Message = "Failed to parse network from env"
			k.Payload = err
		})
	}

	underlyingTokenDecimals, err := strconv.Atoi(underlyingTokenDecimals_)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Format(
				"Failed to convert the decimals from %v! Was %#v!",
				EnvUnderlyingTokenDecimals,
				underlyingTokenDecimals_,
			)

			k.Payload = err
		})
	}

	ethereumDecimalsRat := big.NewRat(EthereumDecimals, 1)

	gethClient, err := ethclient.Dial(ethereumUrl)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Message = "Failed to connect to geth!"
			k.Payload = err
		})
	}

	queue.GetMessages(serverWorkAmqpTopic, func(message queue.Message) {
		var hintedBlock worker.EthereumHintedBlock

		message.Decode(&hintedBlock)

		// set the configuration using what's in the database for the block

		log.Debug(func(k *log.Log) {
			k.Message = "About to fetch worker config from postgres!"
		})

		var (
			workerConfig = worker_config.GetWorkerConfigEthereum(
				dbNetwork,
			)

			defaultSecondsSinceLastBlock = workerConfig.DefaultSecondsSinceLastBlock
			currentAtxTransactionMargin  = workerConfig.CurrentAtxTransactionMargin
			defaultTransfersInBlock      = workerConfig.DefaultTransfersInBlock
			atxBufferSize                = workerConfig.AtxBufferSize
			epochBlocks                  = workerConfig.EpochBlocks
		)

		var (
			currentAtxTransactionMarginRat = new(big.Rat).SetInt64(
				currentAtxTransactionMargin,
			)

			secondsInOneYearRat   = new(big.Rat).SetUint64(SecondsInOneYear)
			secondsSinceLastBlock = defaultSecondsSinceLastBlock
		)

		var (
			blockBaseFee      = hintedBlock.BlockBaseFee
			blockNumber       = hintedBlock.BlockNumber
			blockHash         = hintedBlock.BlockHash
			fluidTransactions = hintedBlock.DecoratedTransactions

			transfersInBlock int
		)

		for _, transfers := range fluidTransactions {
			transfersInBlock += len(transfers.Transfers)
		}

		secondsSinceLastBlockRat := new(big.Rat).SetFloat64(secondsSinceLastBlock)

		secondsSinceLastEpochFloat := secondsSinceLastBlock * float64(epochBlocks)

		secondsSinceLastEpoch := uint64(secondsSinceLastEpochFloat)

		emission := worker.NewEthereumEmission()

		emission.Network = networkId

		emission.TokenDetails = token_details.New(tokenName, underlyingTokenDecimals)

		emission.EthereumBlockNumber = blockNumber

		emission.SecondsSinceLastBlock = uint64(secondsSinceLastBlock)

		addBtx(
			dbNetwork,
			blockNumber.Uint64(),
			tokenName,
			transfersInBlock,
		)

		averageTransfersInBlock, transfersInEpoch := computeTransactionsSumAndAverage(
			dbNetwork,
			tokenName,
			atxBufferSize,
		)

		log.Debugf(
			"Computed average transactions (atx) for the network %v, token name %v, atx buffer size %v is %v",
			dbNetwork,
			tokenName,
			atxBufferSize,
			averageTransfersInBlock,
		)

		emission.AtxBufferSize = atxBufferSize

		emission.TransfersInBlock = transfersInBlock

		emission.AverageTransfersInBlock = float64(averageTransfersInBlock)

		if transfersInBlock == 0 {
			log.Debugf(
				"Couldn't find any Fluid transfers in the block %v!",
				blockHash,
			)

			return
		}

		log.Debugf(
			"Average transfers in block: %#v! Transfers in block: %#v! Transfers in epoch: %#v!",
			averageTransfersInBlock,
			transfersInBlock,
			transfersInEpoch,
		)

		// Sets the average transfers to a default number if the average is less than the default
		if averageTransfersInBlock < defaultTransfersInBlock {
			log.Debugf(
				"Average transfers in block < default transfers in block (25)!",
			)

			averageTransfersInBlock = defaultTransfersInBlock
		}

		// if this block is abnormal and could be an attack, we don't use the
		// average!

		transfersInEpochRat := new(big.Rat).SetInt64(int64(transfersInEpoch))

		epochBlocksRat := new(big.Rat).SetInt64(int64(epochBlocks))

		// average transfers in block over the current epoch
		transfersInBlockOverEpoch := new(big.Rat).Quo(
			transfersInEpochRat,
			epochBlocksRat,
		)

		currentAtxTransactionMarginRatCmp := new(big.Rat).Add(
			transfersInBlockOverEpoch,
			currentAtxTransactionMarginRat,
		)

		averageTransfersInBlockRat := new(big.Rat).SetInt64(
			int64(averageTransfersInBlock),
		)

		// btx should be set when the apy > averageTransfersInBlock

		var (
			btx        int
			currentAtx *big.Rat
		)

		// Sets the ATX to transfers in block if current fluid
		// transfers in block is larger than the average, set to
		// average otherwise example: average BTX is 20, current
		// BTX is 30, BTX that gets passed to worker is 30 example
		// 2: average BTX is 20, current BTX is 10, BTX that gets
		// passed to worker is 20

		if currentAtxTransactionMarginRatCmp.Cmp(averageTransfersInBlockRat) > 0 {

			currentAtx = new(big.Rat).Mul(
				secondsInOneYearRat,
				transfersInBlockOverEpoch,
			)

			currentAtx.Quo(currentAtx, secondsSinceLastBlockRat)

			btx = transfersInEpoch

		} else {

			currentAtx = probability.CalculateAtx(
				secondsSinceLastBlockRat,
				averageTransfersInBlock,
			)

			btx = averageTransfersInBlock * epochBlocks
		}

		ethPriceUsd, err := chainlink.GetPrice(gethClient, chainlinkEthPriceFeed)

		if err != nil {
			log.Fatal(func(k *log.Log) {
				k.Message = "Failed to get the price of eth from chainlink!"
				k.Payload = err
			})
		}

		var blockAnnouncements []worker.EthereumAnnouncement

		for _, transaction := range fluidTransactions {
			var (
				receipt = transaction.Receipt

				transactionHash = transaction.Transaction.Hash
				transactionType = transaction.Transaction.Type
			)

			var transactionFeeNormal *big.Rat

			switch transactionType {
			case ethTypes.LegacyTxType, ethTypes.AccessListTxType:
				transactionFeeNormal = calculateLegacyFeeTransactionFee(
					emission,
					transaction.Transaction,
					receipt,
					ethPriceUsd,
					ethereumDecimalsRat,
				)

			case ethTypes.DynamicFeeTxType:
				transactionFeeNormal = calculateDynamicFeeTransactionFee(
					emission,
					transaction.Transaction,
					receipt,
					blockBaseFee,
					ethPriceUsd,
					ethereumDecimalsRat,
				)

			default:
				log.App(func(k *log.Log) {
					k.Format(
						"Ignoring message with hash %#v for a unsupported fee type!",
						transactionHash,
					)
				})

				continue
			}

			transferCount := len(transaction.Transfers)

			transferCountRat := big.NewRat(int64(transferCount), 1)

			feePerTransfer := new(big.Rat).Quo(transactionFeeNormal, transferCountRat)
			// for each fluid transfer, calculate the actual fee and chances

			for _, transfer := range transaction.Transfers {
				// if we have an application transfer, apply the fee

				var (
					transferFeeNormal = new(big.Rat).Set(feePerTransfer)

					senderAddress_    = transfer.SenderAddress
					recipientAddress_ = transfer.RecipientAddress
					logIndex          = transfer.LogIndex
					appEmission       = transfer.AppEmissions

					// the fluid token is always included
					fluidClients = []appTypes.UtilityName{appTypes.UtilityFluid}
				)

				var (
					senderAddress    = worker_config.LookupFeeSwitch(senderAddress_, dbNetwork)
					recipientAddress = worker_config.LookupFeeSwitch(recipientAddress_, dbNetwork)
				)

				application := applications.ApplicationNone

				if transfer.Decorator != nil {
					var (
						applicationFeeUsd = transfer.Decorator.ApplicationFee
						utility           = transfer.Decorator.UtilityName
					)

					application = transfer.Decorator.Application

					if applicationFeeUsd != nil {
						transferFeeNormal.Add(transferFeeNormal, applicationFeeUsd)
					}

					if utility != "" {
						fluidClients = append(fluidClients, utility)
					}
				}

				emission.TransferFeeNormal, _ = transferFeeNormal.Float64()

				// fetch the token amount, exchange rate, etc from chain

				log.Debugf(
					"Looking up the utility variables at registry %v, for the contract %v and the fluid clients %v",
					registryAddress,
					contractAddress,
					fluidClients,
				)

				pools, err := fluidity.GetUtilityVars(
					gethClient,
					registryAddress,
					contractAddress,
					fluidClients,
				)

				if err != nil {
					log.Fatal(func(k *log.Log) {
						k.Message = "Failed to get trf vars from chain!"
						k.Payload = err
					})
				}

				for _, pool := range pools {
					// trigger
					log.Debugf(
						"Looking up the utility variables at registry %v, for the contract %v and the fluid clients %v, pool size native %v, token decimal scale %v, exchange rate %v, delta weight %v",
						registryAddress,
						contractAddress,
						fluidClients,
						pool.PoolSizeNative,
						pool.TokenDecimalsScale,
						pool.ExchangeRate,
						pool.DeltaWeight,
					)
				}

				var (
					normalPools  []workerTypes.UtilityVars
					specialPools []workerTypes.UtilityVars

					// outputs from the trf
					payouts []PayoutDetails
				)

				for _, pool := range pools {
					calculationType := pool.CalculationType

					if calculationType == workerTypes.CalculationTypeNormal {
						normalPools = append(normalPools, pool)
					} else {
						specialPools = append(specialPools, pool)
					}
				}

				// normal payouts!

				var (
					normalWinningClasses  = fluidity.WinningClasses
					normalPayoutFreqNum   = fluidity.PayoutFreqNum
					normalPayoutFreqDenom = fluidity.PayoutFreqDenom
				)

				normalPayoutFreq := big.NewRat(normalPayoutFreqNum, normalPayoutFreqDenom)

				normalPayout := calculatePayoutDetails(
					workerTypes.TrfModeNormal,
					transferFeeNormal,
					currentAtx,
					normalPayoutFreq,
					normalPools,
					normalWinningClasses,
					btx,
					secondsSinceLastEpoch,
					emission,
				)

				payouts = append(payouts, normalPayout)

				// special payouts!
				for _, specialPool := range specialPools {
					specialPayout := calculateSpecialPayoutDetails(
						dbNetwork,
						specialPool,
						transferFeeNormal,
						currentAtx,
						normalPayoutFreq,
						normalWinningClasses,
						btx,
						secondsSinceLastEpoch,
						emission,
					)
					payouts = append(payouts, specialPayout)
				}

				tokenDetails := token_details.New(
					tokenName,
					underlyingTokenDecimals,
				)

				for _, payoutDetails := range payouts {
					// create announcement and container
					announcement := worker.EthereumAnnouncement{
						TransactionHash: transactionHash,
						BlockNumber:     &blockNumber,
						LogIndex:        logIndex,
						FromAddress:     senderAddress,
						ToAddress:       recipientAddress,
						RandomSource:    payoutDetails.randomSource,
						RandomPayouts:   payoutDetails.randomPayouts,
						TokenDetails:    tokenDetails,
						Application:     application,
					}

					// Fill in emission.NaiveIsWinning

					_ = probability.NaiveIsWinning(announcement.RandomSource, emission)

					if payoutDetails.customPayoutType == "" {
						log.Debug(func(k *log.Log) {
							k.Format("Source payouts for normal payout: %v", payoutDetails.randomSource)
						})
					} else {
						log.Debug(func(k *log.Log) {
							k.Format(
								"Source payouts for special payout type %s: %v",
								payoutDetails.customPayoutType,
								payoutDetails.randomSource,
							)
						})
					}

					emission.TransactionHash = transactionHash.String()
					emission.RecipientAddress = recipientAddress.String()
					emission.SenderAddress = senderAddress.String()

					emission.EthereumAppFees = appEmission

					blockAnnouncements = append(blockAnnouncements, announcement)

					sendEmission(emission)
				}
			}
		}

		queue.SendMessage(publishAmqpQueueName, blockAnnouncements)
	})
}
