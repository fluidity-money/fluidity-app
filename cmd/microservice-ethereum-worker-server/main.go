// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package main

import (
	"math/big"
	"math/rand"
	"strconv"
	"time"

	"github.com/ethereum/go-ethereum/ethclient"

	"github.com/fluidity-money/fluidity-app/common/calculation/probability"
	commonEth "github.com/fluidity-money/fluidity-app/common/ethereum"
	"github.com/fluidity-money/fluidity-app/common/ethereum/chainlink"
	"github.com/fluidity-money/fluidity-app/common/ethereum/fluidity"

	worker_config "github.com/fluidity-money/fluidity-app/lib/databases/postgres/worker"
	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/queue"
	"github.com/fluidity-money/fluidity-app/lib/queues/worker"
	"github.com/fluidity-money/fluidity-app/lib/types/network"
	token_details "github.com/fluidity-money/fluidity-app/lib/types/token-details"
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
)

func main() {
	var (
		serverWorkAmqpTopic      = util.GetEnvOrFatal(EnvServerWorkQueue)
		contractAddress          = mustEthereumAddressFromEnv(EnvContractAddress)
		chainlinkEthPriceFeed    = mustEthereumAddressFromEnv(EnvChainlinkEthPriceFeed)
		tokenName                = util.GetEnvOrFatal(EnvUnderlyingTokenName)
		underlyingTokenDecimals_ = util.GetEnvOrFatal(EnvUnderlyingTokenDecimals)
		publishAmqpQueueName     = util.GetEnvOrFatal(EnvPublishAmqpQueueName)
		ethereumUrl              = util.GetEnvOrFatal(EnvEthereumHttpUrl)
	)

	rand.Seed(time.Now().Unix())

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

	underlyingTokenDecimalsRat := exponentiate(underlyingTokenDecimals)

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
		var (
			workerConfig = worker_config.GetWorkerConfigEthereum(
				network.NetworkEthereum,
			)

			defaultSecondsSinceLastBlock = workerConfig.DefaultSecondsSinceLastBlock
			currentAtxTransactionMargin  = workerConfig.CurrentAtxTransactionMargin
			defaultTransfersInBlock      = workerConfig.DefaultTransfersInBlock
			atxBufferSize                = workerConfig.AtxBufferSize
		)

		var (
			currentAtxTransactionMarginRat = new(big.Rat).SetInt64(currentAtxTransactionMargin)
			secondsInOneYearRat            = new(big.Rat).SetUint64(SecondsInOneYear)
			secondsSinceLastBlock          = defaultSecondsSinceLastBlock
		)

		var (
			blockBaseFee      = hintedBlock.BlockBaseFee
			blockNumber       = hintedBlock.BlockNumber
			blockHash         = hintedBlock.BlockHash
			fluidTransactions = hintedBlock.DecoratedTransactions
			transfersInBlock  int
		)

		for _, transfers := range fluidTransactions {
			transfersInBlock += len(transfers.Transfers)
		}

		secondsSinceLastBlockRat := new(big.Rat).SetUint64(secondsSinceLastBlock)

		emission := worker.NewEthereumEmission()

		emission.Network = "ethereum"

		emission.TokenDetails = token_details.New(tokenName, underlyingTokenDecimals)

		emission.EthereumBlockNumber = blockNumber

		emission.SecondsSinceLastBlock = secondsSinceLastBlock

		averageTransfersInBlock, atxBlocks, atxTxCounts := addAndComputeAverageAtx(
			blockNumber.Uint64(),
			tokenName,
			transfersInBlock,
			atxBufferSize,
		)

		emission.AtxBufferSize = atxBufferSize

		emission.TransfersInBlock = transfersInBlock

		emission.TransfersPast = concatenatePastTransfers(
			atxBlocks,
			atxTxCounts,
		)

		emission.AverageTransfersInBlock = float64(averageTransfersInBlock)

		if transfersInBlock == 0 {
			log.Debugf(
				"Couldn't find any Fluid transfers in the block %v!",
				blockHash,
			)

			return
		}

		log.Debugf(
			"Average transfers in block: %#v! Transfers in block: %#v!",
			averageTransfersInBlock,
			transfersInBlock,
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

		transfersInBlockRat := new(big.Rat).SetInt64(int64(transfersInBlock))

		currentAtxTransactionMarginRatCmp := new(big.Rat).Add(
			transfersInBlockRat,
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

			currentAtx = new(big.Rat).Mul(secondsInOneYearRat, transfersInBlockRat)

			currentAtx.Quo(currentAtx, secondsSinceLastBlockRat)

			btx = transfersInBlock

		} else {

			currentAtx = probability.CalculateAtx(
				secondsSinceLastBlock,
				averageTransfersInBlock,
			)

			btx = averageTransfersInBlock

		}

		ethPriceUsd, err := chainlink.GetPrice(gethClient, chainlinkEthPriceFeed)

		sizeOfThePool, err := fluidity.GetRewardPool(
			gethClient,
			contractAddress,
		)

		if err != nil {
			log.Fatal(func(k *log.Log) {
				k.Format(
					"Failed to get the prize pool in the Fluidity contract! Address %#v!",
					contractAddress.String(),
				)

				k.Payload = err
			})
		}

		// normalise the size of the pool to a normal number!

		sizeOfThePool.Quo(sizeOfThePool, underlyingTokenDecimalsRat)

		var blockAnnouncements []worker.EthereumAnnouncement

		for _, transaction := range fluidTransactions {

			var (
				receipt     = transaction.Receipt

				transactionHash      = transaction.Transaction.Hash
				gasLimit             = transaction.Transaction.Gas
				transferType         = transaction.Transaction.Type
				maxFeePerGas         = transaction.Transaction.GasFeeCap
				maxPriorityFeePerGas = transaction.Transaction.GasTipCap
				gasUsed              = receipt.GasUsed
			)

			if transferType != 2 {
				log.App(func(k *log.Log) {
					k.Format(
						"Ignoring message with hash %#v that isn't London!",
						transactionHash,
					)
				})

				continue
			}

			var (
				gasTipCapRat = bigIntToRat(maxPriorityFeePerGas)
				gasLimitRat  = uint64ToRat(gasLimit)
				gasUsedRat   = bigIntToRat(gasUsed)
			)

			// remember the gas limit and tip cap in the
			// database for comparison later - NOTE that
			// only the gas used is used

			emission.GasLimit = gasLimit

			emission.GasTipCap = maxPriorityFeePerGas

			// remember the inputs to the gas actually used
			// in usd calculation

			emission.GasUsed = gasUsed.Uint64()

			emission.BlockBaseFee = blockBaseFee

			emission.MaxPriorityFeePerGas = maxPriorityFeePerGas

			// normalise the gas limit by dividing it by
			// ethereum decimals then multiplying it to usd

			normalisedGasLimitRat := weiToUsd(gasLimitRat, ethPriceUsd, ethereumDecimalsRat)

			emission.GasLimitNormal, _ = normalisedGasLimitRat.Float64()

			// and normalise the gas tip cap by multiplying
			// ethereum decimals then converting to USD

			normalisedGasTipCapRat := weiToUsd(gasTipCapRat, ethPriceUsd, ethereumDecimalsRat)

			emission.GasTipCapNormal, _ = normalisedGasTipCapRat.Float64()

			// normalise the block base fee by dividing it
			// by the decimals and then multiplying it by usd

			blockBaseFeeRat := new(big.Rat).SetInt(&blockBaseFee.Int)

			normalisedBlockBaseFeePerGasRat := weiToUsd(blockBaseFeeRat, ethPriceUsd, ethereumDecimalsRat)

			emission.BlockBaseFeeNormal, _ = normalisedBlockBaseFeePerGasRat.Float64()

			maxPriorityFeePerGasRat := new(big.Rat).SetInt(&maxPriorityFeePerGas.Int)

			maxFeePerGasRat := new(big.Rat).SetInt(&maxFeePerGas.Int)

			// calculate the effective gas price (all values in wei)

			effectiveGasPrice := commonEth.CalculateEffectiveGasPrice(
				blockBaseFeeRat,
				maxFeePerGasRat,
				maxPriorityFeePerGasRat,
			)

			normalisedEffectiveGasPriceRat := weiToUsd(effectiveGasPrice, ethPriceUsd, ethereumDecimalsRat)

			emission.EffectiveGasPriceNormal, _ = normalisedEffectiveGasPriceRat.Float64()

			// calculate the transfer fee usd, by multiplying
			// the gas used by the effective gas price

			transactionFeeNormal := new(big.Rat).Mul(
				gasUsedRat,
				normalisedEffectiveGasPriceRat,
			)

			transferCount := len(transaction.Transfers)

			transferCountRat := big.NewRat(int64(transferCount), 1)

			feePerTransfer := new(big.Rat).Quo(transactionFeeNormal, transferCountRat)
			// for each fluid transfer, calculate the actual fee and chances

			for _, transfer := range transaction.Transfers {
				// if we have an application transfer, apply the fee

				var (
					transferFeeNormal = new(big.Rat).Set(feePerTransfer)

					senderAddress    = transfer.SenderAddress
					recipientAddress = transfer.RecipientAddress
					appEmission      = transfer.AppEmissions
				)

				if transfer.Decorator != nil {
					applicationFeeUsd := transfer.Decorator.ApplicationFee

					transferFeeNormal.Add(transferFeeNormal, applicationFeeUsd)
				}

				emission.TransferFeeNormal, _ = transferFeeNormal.Float64()

				var (
					winningClasses   = fluidity.WinningClasses
					deltaWeightNum   = fluidity.DeltaWeightNum
					deltaWeightDenom = fluidity.DeltaWeightDenom
					payoutFreqNum    = fluidity.PayoutFreqNum
					payoutFreqDenom  = fluidity.PayoutFreqDenom
				)

				var (
					deltaWeight = big.NewRat(deltaWeightNum, deltaWeightDenom)
					payoutFreq  = big.NewRat(payoutFreqNum, payoutFreqDenom)
				)

				randomN, randomPayouts, _ := probability.WinningChances(
					transferFeeNormal,
					currentAtx,
					sizeOfThePool,
					underlyingTokenDecimalsRat,
					payoutFreq,
					deltaWeight,
					winningClasses,
					btx,
					secondsSinceLastBlock,
					emission,
				)

				res := generateRandomIntegers(
					fluidity.WinningClasses,
					1,
					int(randomN),
				)

				// create announcement and container

				randomSource := make([]uint32, len(res))

				for i, value := range res {
					randomSource[i] = uint32(value)
				}

				tokenDetails := token_details.TokenDetails{
					TokenShortName: tokenName,
					TokenDecimals:  underlyingTokenDecimals,
				}

				announcement := worker.EthereumAnnouncement{
					TransactionHash: transactionHash,
					BlockNumber:     &blockNumber,
					FromAddress:     senderAddress,
					ToAddress:       recipientAddress,
					SourceRandom:    randomSource,
					SourcePayouts:   randomPayouts,
					TokenDetails:    tokenDetails,
				}

				// Fill in emission.NaiveIsWinning

				_ = probability.NaiveIsWinning(announcement.SourceRandom, emission)

				log.Debug(func(k *log.Log) {
					k.Format("Source payouts: %v", randomSource)
				})

				emission.TransactionHash = transactionHash.String()
				emission.RecipientAddress = recipientAddress.String()
				emission.SenderAddress = senderAddress.String()

				emission.EthereumAppFees = appEmission

				blockAnnouncements = append(blockAnnouncements, announcement)

				sendEmission(emission)
			}
		}

		queue.SendMessage(publishAmqpQueueName, blockAnnouncements)
	})
}
