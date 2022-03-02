package main

import (
	"fmt"
	"math/big"
	"math/rand"
	"strconv"
	"time"

	"github.com/ethereum/go-ethereum/ethclient"

	libEthereum "github.com/fluidity-money/fluidity-app/src/worker/ethereum"
	"github.com/fluidity-money/fluidity-app/src/worker/ethereum/compound"
	"github.com/fluidity-money/fluidity-app/src/worker/ethereum/fluidity"
	"github.com/fluidity-money/fluidity-app/src/worker/ethereum/uniswap-anchored-view"
	"github.com/fluidity-money/fluidity-app/src/worker/moving-average"
	"github.com/fluidity-money/fluidity-app/src/worker/probability"

	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/queue"
	"github.com/fluidity-money/fluidity-app/lib/queues/breadcrumb"
	queueEthereum "github.com/fluidity-money/fluidity-app/lib/queues/ethereum"
	"github.com/fluidity-money/fluidity-app/lib/queues/worker"
	"github.com/fluidity-money/fluidity-app/lib/types/ethereum"
	"github.com/fluidity-money/fluidity-app/lib/util"
)

const (
	// KeyServerBlockTime to use when recording block times!
	KeyServerBlockTime = "ethereum.server.block.time"

	// KeyMovingAverageApy to use as the base when calculating the APY using Redis
	KeyMovingAverageApyBase = "ethereum.server.apy.moving-average"

	// CompoundBlocksPerDay to use when calculating Compound's APY
	// (set to 13.5 seconds per block)
	CompoundBlocksPerDay = 6570

	// DefaultSecondsSinceLastBlock to use instead of calculating it on the fly
	DefaultSecondsSinceLastBlock = 13

	// CurrentAtxTransactionMargin as an upper boundary for the abnormal block
	// transfer condition
	CurrentAtxTransactionMargin = 0

	// EthereumDecimalPlaces to use when normalising Eth to USDT
	EthereumDecimalPlaces = 1e6

	// DefaultTransfersInBlock to use when the average transfers in the block
	// are below 0
	DefaultTransfersInBlock = 0

	// SecondsInOneYear to use for ATX calculation
	SecondsInOneYear = 365 * 24 * 60 * 60
)

const (
	// EnvContractAddress to use to find the Fluid contract to identify transfers
	EnvContractAddress = `FLU_ETHEREUM_CONTRACT_ADDR`

	// EnvEthereumHttpUrl to use to get information on the apy and atx from Compound
	EnvEthereumHttpUrl = `FLU_ETHEREUM_HTTP_URL`

	// EnvCTokenAddress to use to get the CToken
	EnvCTokenAddress = `FLU_ETHEREUM_CTOKEN_ADDR`

	// EnvUniswapAnchoredViewAddress to look up to get the price for the asset and Compound
	EnvUniswapAnchoredViewAddress = `FLU_ETHEREUM_UNISWAP_ANCHORED_VIEW_ADDR`

	// EnvCompoundAddress to use when finding the Compound APY for the contract
	EnvCompoundAddress = `FLU_ETHEREUM_COMPOUND_ADDR`

	// EnvUnderlyingTokenName to be mindful of when doing price conversions to USDT
	EnvUnderlyingTokenName = `FLU_ETHEREUM_UNDERLYING_TOKEN_NAME`

	// EnvUnderlyingTokenDecimals to use when normalising the returned value
	// when converting to USDT
	EnvUnderlyingTokenDecimals = `FLU_ETHEREUM_UNDERLYING_TOKEN_DECIMALS`

	// EnvPublishAmqpQueue name to use when sending server-tracked transfers
	// to the client
	EnvPublishAmqpQueueName = `FLU_ETHEREUM_AMQP_QUEUE_NAME`
)

// AtxBufferSize to go back in time to count the average using the database
var AtxBufferSize = roundUp(SecondsInOneYear / DefaultSecondsSinceLastBlock)

func main() {
	var (
		contractAddress_            = util.GetEnvOrFatal(EnvContractAddress)
		cTokenAddress_              = util.GetEnvOrFatal(EnvCTokenAddress)
		uniswapAnchoredViewAddress_ = util.GetEnvOrFatal(EnvUniswapAnchoredViewAddress)
		ethereumUrl                 = util.GetEnvOrFatal(EnvEthereumHttpUrl)
		tokenName                   = util.GetEnvOrFatal(EnvUnderlyingTokenName)
		underlyingTokenDecimals_    = util.GetEnvOrFatal(EnvUnderlyingTokenDecimals)
		publishAmqpQueueName        = util.GetEnvOrFatal(EnvPublishAmqpQueueName)
	)

	rand.Seed(time.Now().Unix())

	var (
		contractAddress            = ethereum.AddressFromString(contractAddress_)
		cTokenAddress              = ethereum.AddressFromString(cTokenAddress_)
		uniswapAnchoredViewAddress = ethereum.AddressFromString(uniswapAnchoredViewAddress_)
	)

	var (
		ethContractAddress            = hexToAddress(contractAddress)
		ethCTokenAddress              = hexToAddress(cTokenAddress)
		ethUniswapAnchoredViewAddress = hexToAddress(uniswapAnchoredViewAddress)
	)

	var (
		currentAtxTransactionMarginRat = new(big.Rat).SetInt64(CurrentAtxTransactionMargin)
		secondsInOneYearRat            = new(big.Rat).SetInt64(SecondsInOneYear)
	)

	keyMovingAverageApy := fmt.Sprintf(
		"%v.%v",
		KeyMovingAverageApyBase,
		tokenName,
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

	crumb := breadcrumb.NewBreadcrumb()

	queueEthereum.Blocks(func(block queueEthereum.Block) {

		defer breadcrumb.SendAndClear(crumb)

		var (
			blockHash    = block.Hash
			transactions = block.Body.Transactions
			blockNumber  = block.Number
			blockBaseFee = block.Header.BaseFee
		)

		blockBaseFeeRat := bigIntToRat(blockBaseFee)

		var secondsSinceLastBlock uint64 = DefaultSecondsSinceLastBlock

		secondsSinceLastBlockRat := new(big.Rat).SetUint64(secondsSinceLastBlock)

		fluidTransfers, err := libEthereum.GetTransfers(
			gethClient,
			contractAddress,
			transactions...,
		)

		if err != nil {
			log.Fatal(func(k *log.Log) {
				k.Message = "Failed to get a fluid transfer!"
				k.Payload = err
			})
		}

		transfersInBlock := len(fluidTransfers)

		averageTransfersInBlock := addAndComputeAverageAtx(
			blockNumber,
			tokenName,
			transfersInBlock,
		)

		if len(fluidTransfers) == 0 {
			log.Debug(func(k *log.Log) {
				k.Format(
					"Couldn't find any Fluid transfers in the block, hash %#v!",
					blockHash,
				)
			})

			return
		}

		crumb.Set(func(k *breadcrumb.Breadcrumb) {
			crumb.One("transfers in block", transfersInBlock)
		})

		debug(
			"Average transfers in block: %#v! Transfers in block: %#v!",
			averageTransfersInBlock,
			transfersInBlock,
		)

		if averageTransfersInBlock < DefaultTransfersInBlock {
			debug(
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

		ethPriceUsd, err := uniswap_anchored_view.GetPrice(
			gethClient,
			ethUniswapAnchoredViewAddress,
			"ETH",
		)

		if err != nil {
			log.Fatal(func(k *log.Log) {
				k.Message = "Failed to get the gas price in USD!"
				k.Payload = err
			})
		}

		// normalise the ethereum price!

		ethPriceUsd.Quo(ethPriceUsd, big.NewRat(EthereumDecimalPlaces, 1))

		tokenApy, err := compound.GetTokenApy(
			gethClient,
			ethCTokenAddress,
			CompoundBlocksPerDay,
			crumb,
		)

		if err != nil {
			log.Fatal(func(k *log.Log) {
				k.Format(
					"Failed to look up the APY using CToken address %#v! %v",
					cTokenAddress,
					err,
				)
			})
		}

		tokenApyAverage, err := moving_average.StoreAndCalculateRat(
			keyMovingAverageApy,
			tokenApy,
		)

		tokenPriceInUsdt, err := uniswap_anchored_view.GetPrice(
			gethClient,
			ethUniswapAnchoredViewAddress,
			tokenName,
		)

		if err != nil {
			log.Fatal(func(k *log.Log) {
				k.Format(
					"Failed to get the token price in USDT! Uniswap anchored view address %#v, token name was %#v!",
					uniswapAnchoredViewAddress,
					tokenName,
				)

				k.Payload = err
			})
		}

		// if the token apy is below the average, then we take the current apy
		// instead of the average, otherwise, the average apy will be passed to
		// the trf, causing an overestimation of Compound's APY on the block

		var currentTokenApy *big.Rat

		if tokenApy.Cmp(tokenApyAverage) < 0 {

			currentTokenApy = tokenApy

		} else {

			currentTokenApy = tokenApyAverage

		}

		currentApyInUsdt := new(big.Rat).Mul(currentTokenApy, tokenPriceInUsdt)

		// we must normalise the value here

		currentApyInUsdt.Quo(currentApyInUsdt, underlyingTokenDecimalsRat)

		bpy := probability.CalculateBpy(secondsSinceLastBlock, currentApyInUsdt, crumb)

		balanceOfUnderlying, err := compound.GetBalanceOfUnderlying(
			gethClient,
			ethCTokenAddress,
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

		balanceOfUnderlying.Quo(balanceOfUnderlying, underlyingTokenDecimalsRat)

		bpyStakedUsd := probability.CalculateBpyStakedUnderlyingAsset(
			bpy,
			balanceOfUnderlying,
		)

		for _, transfer := range fluidTransfers {

			var (
				transactionHash  = transfer.Transaction.Hash
				senderAddress    = transfer.FromAddress
				recipientAddress = transfer.ToAddress
				gasLimit         = transfer.Transaction.Gas
				transferType     = transfer.Transaction.Type
				gasTipCap        = transfer.Transaction.GasTipCap
			)

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

			randomN, randomPayouts := probability.WinningChances(
				transferFeeUsd,
				currentAtx,
				bpyStakedUsd,
				sizeOfThePool,
				underlyingTokenDecimalsRat,
				btx,
				secondsSinceLastBlock,
				crumb,
			)

			res := generateRandomIntegers(probability.WinningClasses, 1, int(randomN))

			// create announcement and container

			randomSource := make([]uint32, 0)

			for _, i := range res {
				randomSource = append(randomSource, uint32(i))
			}

			announcement := worker.Announcement{
				TransactionHash: transactionHash,
				FromAddress:     senderAddress,
				ToAddress:       recipientAddress,
				SourceRandom:    randomSource,
				SourcePayouts:   randomPayouts,
			}

			log.Debug(func(k *log.Log) {
				k.Format("Source payouts: %v", randomSource)
			})

			if err != nil {
				log.Fatal(func(k *log.Log) {
					k.Message = "Failed to make container for announcement!"
					k.Payload = err
				})
			}

			queue.SendMessage(publishAmqpQueueName, announcement)
		}
	})
}
