package main

import (
	"math/big"
	"math/rand"
	"os"
	"strconv"
	"strings"
	"time"

	ethCommon "github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/ethclient"

	"github.com/fluidity-money/fluidity-app/common/aurora/flux"
	"github.com/fluidity-money/fluidity-app/common/calculation/probability"
	libEthereum "github.com/fluidity-money/fluidity-app/common/ethereum"
	"github.com/fluidity-money/fluidity-app/common/ethereum/aave"
	"github.com/fluidity-money/fluidity-app/common/ethereum/applications"
	"github.com/fluidity-money/fluidity-app/common/ethereum/fluidity"
	uniswap_anchored_view "github.com/fluidity-money/fluidity-app/common/ethereum/uniswap-anchored-view"

	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/queue"
	"github.com/fluidity-money/fluidity-app/lib/queues/worker"
	"github.com/fluidity-money/fluidity-app/lib/types/ethereum"
	"github.com/fluidity-money/fluidity-app/lib/types/misc"
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

	// CompoundBlocksPerDay to use when calculating Compound's APY
	// (set to 13.5 seconds per block)
	CompoundBlocksPerDay = 6570

	// DefaultSecondsSinceLastBlock to use instead of calculating it on the fly
	DefaultSecondsSinceLastBlock = 13

	// CurrentAtxTransactionMargin as an upper boundary for the abnormal block
	// transfer condition
	CurrentAtxTransactionMargin = 0

	// DefaultTransfersInBlock to use when the average transfers in the block
	// are below 0
	DefaultTransfersInBlock = 0

	// SecondsInOneYear to use for ATX calculation
	SecondsInOneYear = 365 * 24 * 60 * 60

	// UsdtDecimals to normalise values to
	UsdtDecimals = 1e6
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

	// EnvApplicationContracts to list the application contracts to monitor
	EnvApplicationContracts = `FLU_ETHEREUM_APPLICATION_CONTRACTS`
)

// AtxBufferSize to go back in time to count the average using the database
var AtxBufferSize = roundUp(SecondsInOneYear / DefaultSecondsSinceLastBlock)

func main() {
	var (
		contractAddress_         = util.GetEnvOrFatal(EnvContractAddress)
		tokenBackend             = util.GetEnvOrFatal(EnvTokenBackend)
		tokenName                = util.GetEnvOrFatal(EnvUnderlyingTokenName)
		underlyingTokenDecimals_ = util.GetEnvOrFatal(EnvUnderlyingTokenDecimals)
		publishAmqpQueueName     = util.GetEnvOrFatal(EnvPublishAmqpQueueName)
		ethereumUrl              = util.GetEnvOrFatal(EnvEthereumHttpUrl)
		applicationContracts_    = util.GetEnvOrFatal(EnvApplicationContracts)

		ethereumDecimalPlaces_ = os.Getenv(EnvEthereumDecimalPlaces)

		// EthereumDecimalPlaces to use when normalising Eth to USDT
		EthereumDecimalPlaces *big.Rat
	)

	rand.Seed(time.Now().Unix())

	if ethereumDecimalPlaces_ == "" {
		// default to 6 decimal places
		EthereumDecimalPlaces = big.NewRat(1e6, 1)
	} else {
		// otherwise set to 10^decimals
		decimals_, err := strconv.Atoi(ethereumDecimalPlaces_)

		if err != nil {
			log.Fatal(func(k *log.Log) {
				k.Format(
					"Failed to parse %v as decimals!",
					ethereumDecimalPlaces_,
				)
				k.Payload = err
			})
		}

		EthereumDecimalPlaces = exponentiate(decimals_)
	}

	var (
		ethContractAddress            ethCommon.Address
		ethUniswapAnchoredViewAddress ethCommon.Address
		ethUsdTokenAddress            ethCommon.Address
		ethEthTokenAddress            ethCommon.Address
		ethUnderlyingTokenAddress     ethCommon.Address
		ethAaveAddressProviderAddress ethCommon.Address
		applicationContracts          []string

		auroraEthFluxAddress   ethCommon.Address
		auroraTokenFluxAddress ethCommon.Address
	)

	for _, address := range strings.Split(applicationContracts_, ",") {
		applicationContracts = append(applicationContracts, address)
	}

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

	var (
		currentAtxTransactionMarginRat = new(big.Rat).SetInt64(CurrentAtxTransactionMargin)
		secondsInOneYearRat            = new(big.Rat).SetInt64(SecondsInOneYear)
	)

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

	gethClient, err := ethclient.Dial(ethereumUrl)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Message = "Failed to connect to geth!"
			k.Payload = err
		})
	}

	worker.GetEthereumServerWork(func(serverWork worker.EthereumServerWork) {
		var (
			blockBaseFee misc.BigInt
			logs         []ethereum.Log
			transactions []ethereum.Transaction
			blockNumber  misc.BigInt
			blockHash    ethereum.Hash

			blockLog    = serverWork.EthereumBlockLog
			hintedBlock = serverWork.EthereumHintedBlock

			// if a block log, fluid contract transfers
			// if a hinted block, application events
			fluidTransfers   []worker.EthereumDecoratedTransfer
			transfersInBlock int
		)

		switch true {
		// received from logs queue
		case serverWork.EthereumBlockLog != nil:
			blockBaseFee = blockLog.BlockBaseFee
			logs = blockLog.Logs
			transactions = blockLog.Transactions
			blockNumber = blockLog.BlockNumber
			blockHash = blockLog.BlockHash

		// received from application server
		case serverWork.EthereumHintedBlock != nil:
			blockBaseFee = hintedBlock.BlockBaseFee
			blockNumber = hintedBlock.BlockNumber
			blockHash = hintedBlock.BlockHash
			transfersInBlock = hintedBlock.TransferCount
			fluidTransfers = hintedBlock.DecoratedTransfers

		default:
			log.Fatal(func(k *log.Log) {
				k.Format(
					"Received empty work announcement for block hash %v!",
					blockHash,
				)
			})
		}

		blockBaseFeeRat := bigIntToRat(blockBaseFee)

		var secondsSinceLastBlock uint64 = DefaultSecondsSinceLastBlock

		secondsSinceLastBlockRat := new(big.Rat).SetUint64(secondsSinceLastBlock)

		emission := worker.NewEthereumEmission()

		emission.Network = "ethereum"
		emission.TokenDetails = token_details.New(tokenName, underlyingTokenDecimals)

		emission.EthereumBlockNumber = blockNumber

		if hintedBlock == nil {

			fluidTransfers, err = libEthereum.GetTransfers(
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

			applicationEvent := worker.EthereumApplicationEvent{
				ApplicationTransfers: applicationTransfers,
				BlockLog:             *blockLog,
			}

			if len(applicationTransfers) > 0 {
				log.App(func(k *log.Log) {
					k.Format(
						"Found %v application events in block #%v, sending them to the application server!",
						len(applicationTransfers),
						blockHash,
					)
				})
				queue.SendMessage(worker.TopicEthereumApplicationEvents, applicationEvent)
			}

			transfersInBlock = len(fluidTransfers)
		}

		averageTransfersInBlock := addAndComputeAverageAtx(
			blockNumber.Uint64(),
			tokenName,
			transfersInBlock,
		)

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

		if averageTransfersInBlock < DefaultTransfersInBlock {
			log.Debugf(
				"Average transfers in block < default transfers in block (25)!",
			)

			averageTransfersInBlock = DefaultTransfersInBlock
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

		ethPriceUsd.Quo(ethPriceUsd, EthereumDecimalPlaces)

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
			UsdtDecimalsRat := big.NewRat(UsdtDecimals, 1)

			decimalDifference := new(big.Rat).Quo(EthereumDecimalPlaces, UsdtDecimalsRat)

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
			)

			if transfer.Decorator != nil {
				applicationFeeUsd = transfer.Decorator.ApplicationFee
			}

			var (
				gasTipCapRat = bigIntToRat(gasTipCap)
				gasLimitRat  = uint64ToRat(gasLimit)
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

			transferFeeUsd := new(big.Rat).Add(blockBaseFeeRat, gasTipCapRat)

			transferFeeUsd.Mul(transferFeeUsd, gasLimitRat)

			transferFeeUsd.Mul(transferFeeUsd, ethPriceUsd)

			transferFeeUsd.Quo(transferFeeUsd, big.NewRat(1e18, 1))

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

			blockAnnouncements = append(blockAnnouncements, announcement)

			emission.Update()

			queue.SendMessage(worker.TopicEmissions, emission)
		}

		queue.SendMessage(publishAmqpQueueName, blockAnnouncements)
	})
}
