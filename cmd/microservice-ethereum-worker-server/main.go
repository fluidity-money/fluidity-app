// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package main

import (
	"math/big"
	"os"
	"strconv"
	"strings"

	ethTypes "github.com/ethereum/go-ethereum/core/types"
	"github.com/ethereum/go-ethereum/ethclient"

	"github.com/fluidity-money/fluidity-app/common/calculation/probability"
	commonEth "github.com/fluidity-money/fluidity-app/common/ethereum"
	"github.com/fluidity-money/fluidity-app/common/ethereum/applications"
	"github.com/fluidity-money/fluidity-app/common/ethereum/chainlink"
	"github.com/fluidity-money/fluidity-app/common/ethereum/fluidity"

	"github.com/fluidity-money/fluidity-app/lib/databases/postgres/failsafe"
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

	// EnvAmmLpPoolAddress to switch amm rewards to
	EnvAmmLpPoolAddress = `FLU_ETHEREUM_AMM_LP_POOL_ADDR`

	// EnvEthereumHttpUrl to use to get information on the apy and atx from chainlink
	EnvEthereumHttpUrl = `FLU_ETHEREUM_HTTP_URL`

	// EnvChainlinkEthPriceFeed to get the price of eth in usd from
	EnvChainlinkEthPriceFeed = `FLU_ETHEREUM_CHAINLINK_ETH_FEED_ADDR`

	// EnvChainlinkEthPriceNetworkUrl to use if the network
	// currently in use lacks Chainlink feeds, if set to nothing
	// defaults to FLU_ETHEREUM_HTTP_URL
	EnvChainlinkEthPriceNetworkUrl = `FLU_ETHEREUM_CHAINLINK_HTTP_URL`

	// EnvUnderlyingTokenName to be mindful of when doing price conversions to USDT
	EnvUnderlyingTokenName = `FLU_ETHEREUM_UNDERLYING_TOKEN_NAME`

	// EnvTokenDetails is a list of utility:shortname:decimals
	EnvTokenDetails = `FLU_ETHEREUM_UTILITY_TOKEN_DETAILS`

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

	// EnvGlobalUtilityRewards to always pay out based on the internal config, just utility names.
	EnvGlobalUtilityRewards = `FLU_ETHEREUM_GLOBAL_UTILITY_REWARDS`
)

type PayoutDetails struct {
	randomSource     []uint32
	randomPayouts    map[appTypes.UtilityName][]workerTypes.Payout
	customPayoutType workerTypes.CalculationType
}

func main() {
	var (
		serverWorkAmqpTopic  = util.GetEnvOrFatal(EnvServerWorkQueue)
		publishAmqpQueueName = util.GetEnvOrFatal(EnvPublishAmqpQueueName)
		ethereumUrl          = util.PickEnvOrFatal(EnvEthereumHttpUrl)
		networkId            = util.GetEnvOrFatal(EnvNetwork)
		tokenDetails_        = util.GetEnvOrFatal(EnvTokenDetails)

		contractAddress       = mustEthereumAddressFromEnv(EnvContractAddress)
		registryAddress       = mustEthereumAddressFromEnv(EnvRegistryAddress)
		chainlinkEthPriceFeed = mustEthereumAddressFromEnv(EnvChainlinkEthPriceFeed)

		ammLpPoolAddr_ = mustEthereumAddressFromEnv(EnvAmmLpPoolAddress)

		chainlinkEthPriceFeedUrl = os.Getenv(EnvChainlinkEthPriceNetworkUrl)

		globalUtilityRewards_ = os.Getenv(EnvGlobalUtilityRewards)
	)

	ammLpPoolAddr := commonEth.ConvertGethAddress(ammLpPoolAddr_)

	var dbNetwork network.BlockchainNetwork

	if chainlinkEthPriceFeedUrl == "" {
		chainlinkEthPriceFeedUrl = ethereumUrl
	}

	tokenDetails := make(map[appTypes.UtilityName]token_details.TokenDetails)

	// globalUtilityRewards addressed by the program name

	globalUtilityRewards := make([]appTypes.UtilityName, 0)

	for _, s := range strings.Split(globalUtilityRewards_, ",") {
		if s == "" {
			continue
		}
		globalUtilityRewards = append(globalUtilityRewards, appTypes.UtilityName(s))
	}

	for _, details := range strings.Split(tokenDetails_, ",") {
		parts := strings.Split(details, ":")
		if len(parts) != 3 {
			log.Fatal(func(k *log.Log) {
				k.Format(
					"Invalid token details split '%s'!",
					parts,
				)
			})
		}

		utility := appTypes.UtilityName(parts[0])
		shortName := parts[1]
		decimals_ := parts[2]

		decimals, err := strconv.ParseInt(decimals_, 10, 64)

		if err != nil {
			log.Fatal(func(k *log.Log) {
				k.Message = "Failed to parse decimals from token list env!"
				k.Payload = err
			})
		}

		tokenDetails[utility] = token_details.New(shortName, int(decimals))
	}

	fluidTokenDetails, exists := tokenDetails[appTypes.UtilityFluid]

	if !exists {
		log.Fatal(func(k *log.Log) {
			k.Message = "Fluid token not specified in token details list!"
		})
	}

	tokenName := fluidTokenDetails.TokenShortName
	underlyingTokenDecimals := fluidTokenDetails.TokenDecimals

	dbNetwork, err := network.ParseEthereumNetwork(networkId)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Message = "Failed to parse network from env"
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

	// set the chainlink client's special geth client if needed

	var chainlinkEthPriceClient *ethclient.Client

	if chainlinkEthPriceFeedUrl == "" {
		chainlinkEthPriceClient = gethClient
	} else {
		chainlinkEthPriceClient, err = ethclient.Dial(chainlinkEthPriceFeedUrl)

		if err != nil {
			log.Fatal(func(k *log.Log) {
				k.Message = "Failed to connect to the chainlink geth!"
				k.Payload = err
			})
		}
	}

	// these are the fluid clients that we build off later during our
	// lookup, they need to include the base FLUID client as well as
	// the clients for global utility rewards

	baseFluidClients := append(
		[]appTypes.UtilityName{appTypes.UtilityFluid},
		globalUtilityRewards...,
	)

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

		for _, tx := range fluidTransactions {
			transfersInBlock += len(tx.Transfers)
		}

		movingAverageKey := createMovingAverageKey(dbNetwork, tokenName)

		secondsSinceLastBlockRat := new(big.Rat).SetFloat64(secondsSinceLastBlock)

		secondsSinceLastEpochFloat := secondsSinceLastBlock * float64(epochBlocks)

		secondsSinceLastEpoch := uint64(secondsSinceLastEpochFloat)

		emission := worker.NewEthereumEmission()

		emission.Network = networkId

		emission.TokenDetails = token_details.New(tokenName, underlyingTokenDecimals)

		emission.EthereumBlockNumber = blockNumber

		emission.SecondsSinceLastBlock = uint64(secondsSinceLastBlock)

		// add the transaction count in the block that just came in without
		// recording the block, assuming that things are coming in linearly -
		// this can create issues if infra is having partial downtime and is
		// coming from a backlog

		addBtx(movingAverageKey, transfersInBlock)

		// if this is set, then any excess items in the list should be popped

		shouldAverageTransfersScanPopExcess := atxBufferSize > epochBlocks

		averageTransfersInBlock, _ := computeTransactionsSumAndAverage(
			movingAverageKey,
			atxBufferSize,
			shouldAverageTransfersScanPopExcess,
		)

		log.Debugf(
			"Computed average transactions (atx) for the network %v, token name %v, atx buffer size %v is %v, key %v",
			dbNetwork,
			tokenName,
			atxBufferSize,
			averageTransfersInBlock,
			movingAverageKey,
		)

		// the average transfers scan pop excess check is
		// inverted so we can remove items if the epoch size is
		// larger than the atx buffer size

		_, transfersInEpoch := computeTransactionsSumAndAverage(
			movingAverageKey,
			epochBlocks,
			!shouldAverageTransfersScanPopExcess,
		)

		log.Debugf(
			"Computed transfers in epoch for the network %v, token name %v, atx buffer size %v is %v",
			dbNetwork,
			tokenName,
			atxBufferSize,
			transfersInEpoch,
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

		ethPriceUsd, err := chainlink.GetPrice(
			chainlinkEthPriceClient,
			chainlinkEthPriceFeed,
		)

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

			feePerTransfer := new(big.Rat)

			// if transfer count rat == 0
			if transferCountRat.Cmp(new(big.Rat)) != 0 {
				feePerTransfer.Quo(transactionFeeNormal, transferCountRat)
			}

			for _, transfer := range transaction.Transfers {
				// if we have an application transfer, apply the fee

				var (
					transferFeeNormal = new(big.Rat).Set(feePerTransfer)

					senderAddress_    = transfer.SenderAddress
					recipientAddress_ = transfer.RecipientAddress
					logIndex          = transfer.LogIndex
					appEmission       = transfer.AppEmissions

					// the fluid token is always included (this implicitly copies the slice)
					fluidClients = baseFluidClients
				)

				if logIndex == nil {
					log.Fatal(func(k *log.Log) {
						k.Format(
							"Log index for transaction hash %v is nil!",
							transactionHash,
						)
					})
				}

				// if the amount transferred was exactly 0, then we skip to the next transfer

				if isDecoratedTransferZeroVolume(transfer) {
					log.App(func(k *log.Log) {
						k.Format(
							"Skipped an empty amount transferred, hash %v, log index %v",
							transfer.TransactionHash,
							logIndex,
						)
					})

					continue
				}

				senderAddress, senderAddressChanged := worker_config.LookupFeeSwitch(
					senderAddress_,
					dbNetwork,
				)

				recipientAddress, recipientAddressChanged := worker_config.LookupFeeSwitch(
					recipientAddress_,
					dbNetwork,
				)

				if senderAddress == recipientAddress {
					log.App(func(k *log.Log) {
						k.Format(
							"Ignoring instance of sender and receiver being the same, skipping log index %v!",
							logIndex,
						)

						k.Payload = senderAddress
					})

					continue
				}

				if senderAddressChanged {
					emission.FeeSwitchSender.Reason = workerTypes.FeeSwitchReasonDatabase
					emission.FeeSwitchSender.OriginalAddress = senderAddress_.String()
					emission.FeeSwitchSender.NewAddress = senderAddress.String()
				}

				if recipientAddressChanged {
					emission.FeeSwitchRecipient.Reason = workerTypes.FeeSwitchReasonDatabase
					emission.FeeSwitchRecipient.OriginalAddress = recipientAddress_.String()
					emission.FeeSwitchRecipient.NewAddress = recipientAddress.String()
				}

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

				// proper amm behaviour requires that we switch any fees
				// that would go to the AMM to the fee holding contract instead
				if application == applications.ApplicationSeawaterAmm {
					emission.FeeSwitchRecipient.Reason = workerTypes.FeeSwitchReasonAmm
					recipientAddress = ammLpPoolAddr
					emission.FeeSwitchRecipient.OriginalAddress = recipientAddress_.String()
					emission.FeeSwitchRecipient.NewAddress = recipientAddress.String()
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
					contractAddress, // the token address
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
						"Looked up the utility variables at registry %v, for the contract %v and the fluid clients %v, pool size native %v, token decimal scale %v, exchange rate %v, delta weight %v",
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
					// normalPools are set during a normal transfer based on the TRF
					normalPools []workerTypes.UtilityVars

					// specialPools are set on a per-application basis based
					// on the type of application used
					specialPools []workerTypes.UtilityVars

					// outputs from the trf
					payouts []PayoutDetails
				)

				zeroRat := big.NewRat(0, 1)

				for _, pool := range pools {
					if pool.PoolSizeNative.Cmp(zeroRat) == 0 {
						log.Debug(func(k *log.Log) {
							k.Format(
								"Skipping empty pool %+v!",
								pool,
							)
						})

						continue
					}

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

				// append special (utility client) payouts

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

				tokenDetails := fluidTokenDetails

				// check if we've processed this before as a final failsafe before we submit
				// the balls via a message and store an emission

				failsafe.CommitTransactionHashIndex(transactionHash, *logIndex)

				for _, payoutDetails := range payouts {

					log.Debug(func(k *log.Log) {
						k.Format(
							"Transaction with hash %v, log index %v had application %v",
							transactionHash,
							logIndex,
							application.String(),
						)
					})
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
						Decorator:       transfer.Decorator,
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
