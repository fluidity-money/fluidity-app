// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package main

import (
	"math/big"
	"math/rand"
	"strconv"
	"time"

	ethCommon "github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/ethclient"

	"github.com/fluidity-money/fluidity-app/common/aurora/flux"
	"github.com/fluidity-money/fluidity-app/common/calculation/probability"
	"github.com/fluidity-money/fluidity-app/common/ethereum/aave"
	"github.com/fluidity-money/fluidity-app/common/ethereum/fluidity"
	uniswap_anchored_view "github.com/fluidity-money/fluidity-app/common/ethereum/uniswap-anchored-view"

	worker_config "github.com/fluidity-money/fluidity-app/lib/databases/postgres/worker"
	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/queue"
	"github.com/fluidity-money/fluidity-app/lib/queues/worker"
	"github.com/fluidity-money/fluidity-app/lib/types/ethereum"
	"github.com/fluidity-money/fluidity-app/lib/types/network"
	token_details "github.com/fluidity-money/fluidity-app/lib/types/token-details"
	"github.com/fluidity-money/fluidity-app/lib/util"
)

const (
	// BackendCompound to use as the environment variable when the token
	// is compound based
	BackendCompound = "compound"

	// BackendAave to use as the environment variable when the token
	// is aave based
	BackendAave = "aave"

	// BackendAurora to use as the environment variable for Aurora
	// to use Flux as a price oracle
	BackendAurora = "aurora"

	// SecondsInOneYear to use for ATX calculation
	SecondsInOneYear uint64 = 365 * 24 * 60 * 60

	// UsdtDecimals to normalise values to
	UsdtDecimals = 1e6

	// EthereumDecimals to normalise values to
	EthereumDecimals = 1e18
)

const (
	// EnvContractAddress to use to find the Fluid contract to identify transfers
	EnvContractAddress = `FLU_ETHEREUM_CONTRACT_ADDR`

	// EnvEthereumHttpUrl to use to get information on the apy and atx from Compound
	EnvEthereumHttpUrl = `FLU_ETHEREUM_HTTP_URL`

	// EnvTokenBackend is `compound` if the token is compound based,
	// or `aave` if aave based
	EnvTokenBackend = `FLU_ETHEREUM_TOKEN_BACKEND`

	// EnvCTokenAddress to use to get the CToken
	EnvCTokenAddress = `FLU_ETHEREUM_CTOKEN_ADDR`

	// EnvUniswapAnchoredViewAddress to look up to get the price for the asset and Compound
	EnvUniswapAnchoredViewAddress = `FLU_ETHEREUM_UNISWAP_ANCHORED_VIEW_ADDR`

	// EnvAaveAddressProviderAddress to find aave related addresses
	EnvAaveAddressProviderAddress = `FLU_ETHEREUM_AAVE_ADDRESS_PROVIDER_ADDR`

	// EnvATokenAddress to use to get the AToken
	EnvATokenAddress = `FLU_ETHEREUM_ATOKEN_ADDR`

	// EnvUsdTokenAddress to use to get the price of eth from aave
	EnvUsdTokenAddress = `FLU_ETHEREUM_USD_TOKEN_ADDR`

	// EnvEthTokenAddress to use to get the price of eth from aave
	EnvEthTokenAddress = `FLU_ETHEREUM_ETH_TOKEN_ADDR`

	// EnvUnderlyingTokenAddress to use to get the apy from aave
	EnvUnderlyingTokenAddress = `FLU_ETHEREUM_UNDERLYING_TOKEN_ADDR`

	// EnvUnderlyingTokenName to be mindful of when doing price conversions to USDT
	EnvUnderlyingTokenName = `FLU_ETHEREUM_UNDERLYING_TOKEN_NAME`

	// EnvUnderlyingTokenDecimals to use when normalising the returned value
	// when converting to USDT
	EnvUnderlyingTokenDecimals = `FLU_ETHEREUM_UNDERLYING_TOKEN_DECIMALS`

	// EnvEthereumDecimalPlaces to use when normalising Eth to USDT
	EnvEthereumDecimalPlaces = `FLU_ETHEREUM_ETH_DECIMAL_PLACES`

	// EnvAuroraEthFluxAddress for fetching the price of Eth from a Flux oracle
	EnvAuroraEthFluxAddress = `FLU_AURORA_ETH_FLUX_ADDRESS`

	// EnvAuroraTokenFluxAddress for fetching the price of the underlying token
	// from a Flux oracle
	EnvAuroraTokenFluxAddress = `FLU_AURORA_TOKEN_FLUX_ADDRESS`

	// EnvPublishAmqpQueue name to use when sending server-tracked transfers
	// to the client
	EnvPublishAmqpQueueName = `FLU_ETHEREUM_AMQP_QUEUE_NAME`

	// EnvMovingAverageRedisKey to track the APY moving average with
	EnvMovingAverageRedisKey = `FLU_ETHEREUM_REDIS_APY_MOVING_AVERAGE_KEY`

	// EnvServerWorkQueue to receive serverwork from
	EnvServerWorkQueue = `FLU_ETHEREUM_WORK_QUEUE`
)

func main() {
	var (
		serverWorkAmqpTopic      = util.GetEnvOrFatal(EnvServerWorkQueue)
		contractAddress_         = util.GetEnvOrFatal(EnvContractAddress)
		tokenBackend             = util.GetEnvOrFatal(EnvTokenBackend)
		tokenName                = util.GetEnvOrFatal(EnvUnderlyingTokenName)
		underlyingTokenDecimals_ = util.GetEnvOrFatal(EnvUnderlyingTokenDecimals)
		publishAmqpQueueName     = util.GetEnvOrFatal(EnvPublishAmqpQueueName)
		ethereumUrl              = util.GetEnvOrFatal(EnvEthereumHttpUrl)
	)

	rand.Seed(time.Now().Unix())

	var (
		ethContractAddress            ethCommon.Address
		ethUniswapAnchoredViewAddress ethCommon.Address
		ethUsdTokenAddress            ethCommon.Address
		ethEthTokenAddress            ethCommon.Address
		ethUnderlyingTokenAddress     ethCommon.Address
		ethAaveAddressProviderAddress ethCommon.Address

		auroraEthFluxAddress   ethCommon.Address
		auroraTokenFluxAddress ethCommon.Address
	)

	switch tokenBackend {
	case BackendCompound:
		uniswapAnchoredViewAddress := mustEthereumAddressFromEnv(EnvUniswapAnchoredViewAddress)

		ethUniswapAnchoredViewAddress = hexToAddress(uniswapAnchoredViewAddress)

	case BackendAave:
		var (
			aaveAddressProviderAddress = mustEthereumAddressFromEnv(EnvAaveAddressProviderAddress)
			usdTokenAddress            = mustEthereumAddressFromEnv(EnvUsdTokenAddress)
			ethTokenAddress            = mustEthereumAddressFromEnv(EnvEthTokenAddress)
			underlyingTokenAddress     = mustEthereumAddressFromEnv(EnvUnderlyingTokenAddress)
		)

		ethAaveAddressProviderAddress = hexToAddress(aaveAddressProviderAddress)
		ethUsdTokenAddress = hexToAddress(usdTokenAddress)
		ethUnderlyingTokenAddress = hexToAddress(underlyingTokenAddress)
		ethEthTokenAddress = hexToAddress(ethTokenAddress)

	case BackendAurora:
		var (
			ethFluxAddress   = mustEthereumAddressFromEnv(EnvAuroraEthFluxAddress)
			tokenFluxAddress = mustEthereumAddressFromEnv(EnvAuroraTokenFluxAddress)
		)

		auroraEthFluxAddress = hexToAddress(ethFluxAddress)
		auroraTokenFluxAddress = hexToAddress(tokenFluxAddress)

	default:
		log.Fatal(func(k *log.Log) {
			k.Format(
				"%s should be `aave`, `compound`, or `aurora`, got %s",
				EnvTokenBackend,
				tokenBackend,
			)
		})
	}

	contractAddress := ethereum.AddressFromString(contractAddress_)

	ethContractAddress = hexToAddress(contractAddress)

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
	usdtDecimalsRat := big.NewRat(UsdtDecimals, 1)

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
			workerConfig                 = worker_config.GetWorkerConfigEthereum(network.NetworkEthereum)
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
			blockBaseFee     = hintedBlock.BlockBaseFee
			blockNumber      = hintedBlock.BlockNumber
			blockHash        = hintedBlock.BlockHash
			fluidTransfers   = hintedBlock.DecoratedTransfers
			transfersInBlock = len(fluidTransfers)
		)

		blockBaseFeeRat := bigIntToRat(blockBaseFee)

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

		averageTransfersInBlockRat := new(big.Rat).SetInt64(int64(averageTransfersInBlock))

		// btx should be set when the apy > averageTransfersInBlock

		var (
			btx        int
			currentAtx *big.Rat
		)

		// Sets the ATX to transfers in block if current fluid transfers in block is larger than the average, set to average otherwise
		// example: average BTX is 20, current BTX is 30, BTX that gets passed to worker is 30
		// example 2: average BTX is 20, current BTX is 10, BTX that gets passed to worker is 20
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

		var ethPriceUsd *big.Rat

		switch tokenBackend {
		case BackendCompound:
			ethPriceUsd, err = uniswap_anchored_view.GetPrice(
				gethClient,
				ethUniswapAnchoredViewAddress,
				"ETH",
			)

		case BackendAave:
			ethPriceUsd, err = aave.GetPrice(
				gethClient,
				ethAaveAddressProviderAddress,
				ethEthTokenAddress,
				ethUsdTokenAddress,
			)

		case BackendAurora:
			ethPriceUsd, err = flux.GetPrice(
				gethClient,
				auroraEthFluxAddress,
			)
		}

		if err != nil {
			log.Fatal(func(k *log.Log) {
				k.Message = "Failed to get the gas price in USD!"
				k.Payload = err
			})
		}

		// normalise the ethereum price!

		ethPriceUsd.Quo(ethPriceUsd, ethereumDecimalsRat)

		var tokenPriceInUsdt *big.Rat

		switch tokenBackend {
		case BackendCompound:
			tokenPriceInUsdt, err = uniswap_anchored_view.GetPrice(
				gethClient,
				ethUniswapAnchoredViewAddress,
				tokenName,
			)

			if err != nil {
				log.Fatal(func(k *log.Log) {
					k.Format(
						"Failed to get the token price in USDT! Uniswap anchored view address %#v, token name was %#v!",
						ethUniswapAnchoredViewAddress,
						tokenName,
					)

					k.Payload = err
				})
			}

		case BackendAave:
			tokenPriceInUsdt, err = aave.GetPrice(
				gethClient,
				ethAaveAddressProviderAddress,
				ethUnderlyingTokenAddress,
				ethUsdTokenAddress,
			)

			if err != nil {
				log.Fatal(func(k *log.Log) {
					k.Format(
						"Failed to get the token price in USDT from aave! Underlying token address %v",
						ethUnderlyingTokenAddress,
					)
					k.Payload = err
				})
			}

		case BackendAurora:
			tokenPriceInUsdt, err = flux.GetPrice(
				gethClient,
				auroraTokenFluxAddress,
			)

			if err != nil {
				log.Fatal(func(k *log.Log) {
					k.Format(
						"Failed to get the token price in USDT! Flux Oracle Address address %#v",
						auroraTokenFluxAddress,
					)

					k.Payload = err
				})
			}

			// normalise the token price!
			// tokenPrice / 10^(fluxDecimals-usdtDecimals)


			decimalDifference := new(big.Rat).Quo(ethereumDecimalsRat, usdtDecimalsRat)

			tokenPriceInUsdt.Quo(tokenPriceInUsdt, decimalDifference)
		}

		sizeOfThePool, err := fluidity.GetRewardPool(
			gethClient,
			ethContractAddress,
		)

		if err != nil {
			log.Fatal(func(k *log.Log) {
				k.Format(
					"Failed to get the prize pool in the Fluidity contract! Address %#v!",
					contractAddress,
				)

				k.Payload = err
			})
		}

		// normalise the size of the pool and the balance of the underlying to a normal number!

		sizeOfThePool.Quo(sizeOfThePool, underlyingTokenDecimalsRat)

		var blockAnnouncements []worker.EthereumAnnouncement

		for _, transfer := range fluidTransfers {

			var (
				transactionHash   = transfer.Transaction.Hash
				senderAddress     = transfer.SenderAddress
				recipientAddress  = transfer.RecipientAddress
				gasLimit          = transfer.Transaction.Gas
				transferType      = transfer.Transaction.Type
				gasTipCap         = transfer.Transaction.GasTipCap
				applicationFeeUsd *big.Rat
				appEmission       = transfer.AppEmissions
			)

			if transfer.Decorator != nil {
				applicationFeeUsd = transfer.Decorator.ApplicationFee
			}

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
				gasTipCapRat = bigIntToRat(gasTipCap)
				gasLimitRat  = uint64ToRat(gasLimit)
			)

			// remember the gas limit and tip cap in the database for comparison later

			emission.GasLimit = gasLimit

			emission.GasTipCap = gasTipCap

			// normalise the gas limit to a rational number that's consistent with USDT

			normalisedGasLimitRat := new(big.Rat).Quo(gasLimitRat, ethereumDecimalsRat)

			normalisedGasLimitRat.Mul(normalisedGasLimitRat, ethPriceUsd)

			emission.GasLimitNormal, _ = normalisedGasLimitRat.Float64()

			// and normalise the gas tip cap

			normalisedGasTipCapRat := new(big.Rat).Quo(gasTipCapRat, ethereumDecimalsRat)

			normalisedGasTipCapRat.Mul(normalisedGasTipCapRat, ethPriceUsd)

			emission.GasTipCapNormal, _ = normalisedGasTipCapRat.Float64()

			// add the default block base fee that we track and multiply it by the gas tip cap and the gas limit

			transferFeeUsd := new(big.Rat).Add(blockBaseFeeRat, normalisedGasTipCapRat)

			transferFeeUsd.Mul(transferFeeUsd, normalisedGasLimitRat)

			emission.TransferFeeNormal, _ = transferFeeUsd.Float64()

			// if we have an application transfer, apply the fee

			if applicationFeeUsd != nil {
				transferFeeUsd.Add(transferFeeUsd, applicationFeeUsd)
			}

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
				transferFeeUsd,
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

		queue.SendMessage(publishAmqpQueueName, blockAnnouncements)
	})
}
