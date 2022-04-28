package main

import (
	"math"
	"time"

	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/queue"
	"github.com/fluidity-money/fluidity-app/lib/queues/ethereum"
	prize_pool "github.com/fluidity-money/fluidity-app/lib/queues/prize-pool"
	"github.com/fluidity-money/fluidity-app/lib/types/network"
	"github.com/fluidity-money/fluidity-app/lib/util"

	"github.com/fluidity-money/fluidity-app/common/ethereum/fluidity"
	uniswap_anchored_view "github.com/fluidity-money/fluidity-app/common/ethereum/uniswap-anchored-view"

	ethCommon "github.com/ethereum/go-ethereum/common"
)

const (
	// EnvEthereumHttpAddress to connect to to access Geth
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
					fluidAddress  = work.fluidAddress
					tokenName     = work.tokenName
					tokenDecimals = work.tokenDecimals
				)

				switch tokenBackend {
				case BackendCompound:
					tokenPrice, err = uniswap_anchored_view.GetPrice(
						gethClient,
						uniswapAnchoredViewAddressEth,
						tokenName,
					)

				case BackendAave:
					tokenPrice, err = aave.GetPrice(
						gethClient,
						AaveAddressProviderAddressEth,
						address,
						UsdTokenAddressEth,
					)
				}

				if err != nil {
					log.Fatal(func(k *log.Log) {
						k.Format(
							"Failed to get the current exchange rate for %#v with address %#v at %#v!",
							tokenName,
							uniswapAnchoredViewAddress,
						)

						k.Payload = err
					})
				}

				tokenPrice.Quo(tokenPrice, tokenDecimals)

				prizePool, err := fluidity.GetRewardPool(gethClient, fluidAddress)

				if err != nil {
					log.Fatal(func(k *log.Log) {
						k.Format(
							"Failed to query %#v to get the prize pool size!",
							address,
						)

						k.Payload = err
					})
				}

				prizePoolAdjusted := prizePool.Quo(prizePool, tokenDecimals)

				// multiply the token price with the exchange rate to get it in USD...

				log.Debug(func(k *log.Log) {
					k.Format(
						"Prize pool: %v, token price: %v",
						prizePoolAdjusted.FloatString(10),
						tokenPrice.FloatString(10),
					)
				})

				prizePoolAdjusted.Mul(prizePoolAdjusted, tokenPrice)

				prizePoolFloat, _ := prizePoolAdjusted.Float64()

				tokenDetailsComplete := TokenDetails{
					fluidAddress:  fluidAddress,
					tokenName:     tokenName,
					tokenDecimals: tokenDecimals,
					amount:        prizePoolFloat,
					address:       address,
				}

				doneChan <- tokenDetailsComplete
			}
		}()
	}

	// we don't actually care about the block state!

	ethereum.BlockHeaders(func(_ ethereum.BlockHeader) {

		var amount float64

		for _, tokenDetail := range tokenDetails {
			workChan <- tokenDetail
		}

		for range tokenDetails {
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
