package main

import (
	"math"
	"math/big"
	"time"

	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/queue"
	"github.com/fluidity-money/fluidity-app/lib/queues/ethereum"
	"github.com/fluidity-money/fluidity-app/lib/queues/prize-pool"
	"github.com/fluidity-money/fluidity-app/lib/types/network"
	"github.com/fluidity-money/fluidity-app/lib/util"

	"github.com/fluidity-money/microservice-track-prize-pool/lib"
	"github.com/fluidity-money/microservice-track-prize-pool/lib/uniswap-anchored-view"

	ethCommon "github.com/ethereum/go-ethereum/common"
)

const (
	// EnvContractAddress to use to get the contract address
	EnvContractAddress = `FLU_ETHEREUM_CONTRACT_ADDR`

	// EnvEthereumWsAddress to connect to to access Geth
	EnvEthereumHttpAddress = `FLU_ETHEREUM_HTTP_URL`

	// EnvTokensList to use to identify Fluidity f token addresses, their name
	// and their decimal places
	EnvTokensList = `FLU_ETHEREUM_TOKENS_LIST`

	// EnvUniswapAnchoredViewAddress to use to use the Uniswap price oracle to
	// get the price the token when making the prize pool
	EnvUniswapAnchoredViewAddress = `FLU_ETHEREUM_UNISWAP_ANCHORED_VIEW_ADDR`

	// WorkerPoolAmount to have running as goroutines to send work to
	WorkerPoolAmount = 30
)

func main() {
	var (
		contractAddress            = util.GetEnvOrFatal(EnvContractAddress)
		gethAddress                = util.GetEnvOrFatal(EnvEthereumHttpAddress)
		tokensList_                = util.GetEnvOrFatal(EnvTokensList)
		uniswapAnchoredViewAddress = util.GetEnvOrFatal(EnvUniswapAnchoredViewAddress)
	)

	uniswapAnchoredViewAddressEth := ethCommon.HexToAddress(uniswapAnchoredViewAddress)

	// getGethConnection, causing Fatal to trigger if we don't succeed.

	gethClient := getGethClient(gethAddress)

	// tokensList will Fatal if bad input

	tokenDetails := getTokensList(tokensList_)

	var (
		workChan = make(chan TokenDetails, 0)
		doneChan = make(chan TokenDetails, 0)
	)

	for i := 0; i < WorkerPoolAmount; i++ {
		go func() {
			for work := range workChan {

				var (
					address       = work.address
					tokenName     = work.tokenName
					tokenDecimals = work.tokenDecimals
				)

				tokenPrice, err := uniswap_anchored_view.GetPrice(
					gethClient,
					uniswapAnchoredViewAddressEth,
					tokenName,
				)

				if err != nil {
					log.Fatal(func(k *log.Log) {
						k.Format(
							"Failed to get the current exchange rate for %#v at %#v!",
							tokenName,
							uniswapAnchoredViewAddress,
						)

						k.Payload = err
					})
				}

				tokenPrice.Quo(tokenPrice, tokenDecimals)

				fluidityContract, err := microservice_track_prize_pool.NewFluidityContract(
					contractAddress,
					gethClient,
				)

				if err != nil {
					log.Fatal(func(k *log.Log) {
						k.Message = "Failed to create new Fluidity contract!"
						k.Payload = err
					})
				}

				prizePool, err := fluidityContract.GetPrizePool()

				if err != nil {
					log.Fatal(func(k *log.Log) {
						k.Format(
							"Failed to query %#v to get the prize pool size!",
							address,
						)

						k.Payload = err
					})
				}

				prizePoolAdjusted := new(big.Rat).SetInt(prizePool)

				prizePoolAdjusted.Quo(prizePoolAdjusted, tokenDecimals)

				// multiply the token price with the exchange rate to get it in USD...

				log.Debug(func(k *log.Log) {
					k.Format(
						"Prize pool: %v, token price: %v",
						prizePoolAdjusted.FloatString(10),
						tokenDecimals.FloatString(10),
					)
				})

				prizePoolAdjusted.Mul(prizePoolAdjusted, tokenPrice)

				prizePoolFloat, _ := prizePoolAdjusted.Float64()

				tokenDetailsComplete := TokenDetails{
					address:       address,
					tokenName:     tokenName,
					tokenDecimals: tokenDecimals,
					amount:        prizePoolFloat,
				}

				doneChan <- tokenDetailsComplete
			}
		}()
	}

	// we don't actually care about the block state!

	ethereum.Blocks(func(_ ethereum.Block) {

		var amount float64

		for _, tokenDetail := range tokenDetails {
			workChan <- tokenDetail
		}

		for _ = range tokenDetails {
			tokenDetails := <-doneChan

			amount += tokenDetails.amount
		}

		amount = math.Ceil(amount)

		prizePool := prize_pool.PrizePool{
			Network:     string(network.NetworkEthereum),
			Amount:      amount,
			LastUpdated: time.Now(),
		}

		queue.SendMessage(
			prize_pool.TopicPrizePoolEthereum,
			prizePool,
		)
	})
}
