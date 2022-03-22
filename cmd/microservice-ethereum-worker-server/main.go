package main

import (
	"fmt"
	"math/big"
	"math/rand"
	"os"
	"strconv"
	"time"

	ethCommon "github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/ethclient"

	"github.com/fluidity-money/fluidity-app/common/calculation/moving-average"
	"github.com/fluidity-money/fluidity-app/common/calculation/probability"
	libEthereum "github.com/fluidity-money/fluidity-app/common/ethereum"
	"github.com/fluidity-money/fluidity-app/common/ethereum/aave"
	"github.com/fluidity-money/fluidity-app/common/ethereum/compound"
	"github.com/fluidity-money/fluidity-app/common/ethereum/fluidity"
	"github.com/fluidity-money/fluidity-app/common/ethereum/uniswap-anchored-view"

	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/queue"
	"github.com/fluidity-money/fluidity-app/lib/queues/breadcrumb"
	"github.com/fluidity-money/fluidity-app/lib/queues/worker"
	"github.com/fluidity-money/fluidity-app/lib/types/ethereum"
	"github.com/fluidity-money/fluidity-app/lib/util"
)

const (
	// BackendCompound to use as the environment variable when the token
	// is compound based
	BackendCompound = "compound"

	// BackendAave to use as the environment variable when the token
	// is aave based
	BackendAave = "aave"

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

	// EnvPublishAmqpQueue name to use when sending server-tracked transfers
	// to the client
	EnvPublishAmqpQueueName = `FLU_ETHEREUM_AMQP_QUEUE_NAME`
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

		cTokenAddress_              = os.Getenv(EnvCTokenAddress)
		uniswapAnchoredViewAddress_ = os.Getenv(EnvUniswapAnchoredViewAddress)
		aTokenAddress_              = os.Getenv(EnvATokenAddress)
		usdTokenAddress_            = os.Getenv(EnvUsdTokenAddress)
		ethTokenAddress_            = os.Getenv(EnvEthTokenAddress)
		underlyingTokenAddress_     = os.Getenv(EnvUnderlyingTokenAddress)
		aaveAddressProviderAddress_ = os.Getenv(EnvAaveAddressProviderAddress)
	)

	rand.Seed(time.Now().Unix())

	var (
		ethContractAddress            ethCommon.Address
		ethCTokenAddress              ethCommon.Address
		ethUniswapAnchoredViewAddress ethCommon.Address
		ethATokenAddress              ethCommon.Address
		ethUsdTokenAddress            ethCommon.Address
		ethEthTokenAddress            ethCommon.Address
		ethUnderlyingTokenAddress     ethCommon.Address
		ethAaveAddressProviderAddress ethCommon.Address
	)

	switch tokenBackend {
	case BackendCompound:

		var (
			cTokenAddress              = ethereum.AddressFromString(cTokenAddress_)
			uniswapAnchoredViewAddress = ethereum.AddressFromString(uniswapAnchoredViewAddress_)
		)

		if cTokenAddress == "" || uniswapAnchoredViewAddress == "" {
			log.Fatal(func(k *log.Log) {
				k.Format(
					"%s set to compound, but missing %s or %s!",
					EnvTokenBackend,
					EnvCTokenAddress,
					EnvUniswapAnchoredViewAddress,
				)
			})
		}

		ethCTokenAddress = hexToAddress(cTokenAddress)
		ethUniswapAnchoredViewAddress = hexToAddress(uniswapAnchoredViewAddress)

	case BackendAave:

		var (
			aTokenAddress              = ethereum.AddressFromString(aTokenAddress_)
			aaveAddressProviderAddress = ethereum.AddressFromString(aaveAddressProviderAddress_)
			usdTokenAddress            = ethereum.AddressFromString(usdTokenAddress_)
			ethTokenAddress            = ethereum.AddressFromString(ethTokenAddress_)
			underlyingTokenAddress     = ethereum.AddressFromString(underlyingTokenAddress_)
		)

		ethereumAddressesEmpty := anyEthereumAddressesEmpty(
			aTokenAddress,
			aaveAddressProviderAddress,
			usdTokenAddress,
			ethTokenAddress,
		)

		stringsEmpty := anyStringsEmpty(underlyingTokenAddress_)

		if ethereumAddressesEmpty || stringsEmpty {
			log.Fatal(func(k *log.Log) {
				k.Format(
					"%s set to aave, but missing arguments!",
					BackendAave,
					EnvATokenAddress,
					EnvAaveAddressProviderAddress,
				)
			})
		}

		ethATokenAddress = hexToAddress(aTokenAddress)
		ethAaveAddressProviderAddress = hexToAddress(aaveAddressProviderAddress)
		ethUsdTokenAddress = hexToAddress(usdTokenAddress)
		ethUnderlyingTokenAddress = hexToAddress(underlyingTokenAddress)
		ethEthTokenAddress = hexToAddress(ethTokenAddress)

	default:

		log.Fatal(func(k *log.Log) {
			k.Format(
				"%s should be `aave` or `compound`, got %s",
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

	worker.EthereumBlockLogs(func(blockLog worker.EthereumBlockLog) {
		defer breadcrumb.SendAndClear(crumb)

		var (
			blockHash    = blockLog.BlockHash
			blockBaseFee = blockLog.BlockBaseFee
			logs         = blockLog.Logs
			transactions = blockLog.Transactions
			blockNumber  = blockLog.BlockNumber
		)

		blockBaseFeeRat := bigIntToRat(blockBaseFee)

		var secondsSinceLastBlock uint64 = DefaultSecondsSinceLastBlock

		secondsSinceLastBlockRat := new(big.Rat).SetUint64(secondsSinceLastBlock)

		fluidTransfers, err := libEthereum.GetTransfers(logs, transactions, blockHash, contractAddress)

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
		}

		if err != nil {
			log.Fatal(func(k *log.Log) {
				k.Message = "Failed to get the gas price in USD!"
				k.Payload = err
			})
		}

		// normalise the ethereum price!

		ethPriceUsd.Quo(ethPriceUsd, big.NewRat(EthereumDecimalPlaces, 1))

		var tokenApy *big.Rat

		if tokenBackend == BackendCompound {
			tokenApy, err = compound.GetTokenApy(
				gethClient,
				ethCTokenAddress,
				CompoundBlocksPerDay,
				crumb,
			)

			if err != nil {
				log.Fatal(func(k *log.Log) {
					k.Format(
						"Failed to look up the APY using CToken address %#v! %v",
						ethCTokenAddress,
						err,
					)
				})
			}
		} else if tokenBackend == BackendAave {
			tokenApy, err = aave.GetTokenApy(
				gethClient,
				ethAaveAddressProviderAddress,
				ethUnderlyingTokenAddress,
				crumb,
			)

			if err != nil {
				log.Fatal(func(k *log.Log) {
					k.Format(
						"Failed to look up the APY using AToken address %#v! %v",
						ethATokenAddress,
						err,
					)
				})
			}
		}

		tokenApyAverage, err := moving_average.StoreAndCalculateRat(
			keyMovingAverageApy,
			tokenApy,
		)

		var tokenPriceInUsdt *big.Rat
		if tokenBackend == BackendCompound {
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
		} else if tokenBackend == BackendAave {
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

			announcement := worker.EthereumAnnouncement{
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
