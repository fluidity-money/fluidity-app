// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE file.

package main

import (
	"math"
	"math/big"
	"os"
	"time"

	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/queue"
	ethereumQueue "github.com/fluidity-money/fluidity-app/lib/queues/ethereum"
	prize_pool "github.com/fluidity-money/fluidity-app/lib/queues/prize-pool"
	"github.com/fluidity-money/fluidity-app/lib/types/network"
	"github.com/fluidity-money/fluidity-app/lib/util"

	"github.com/fluidity-money/fluidity-app/common/aurora/flux"
	"github.com/fluidity-money/fluidity-app/common/ethereum"
	"github.com/fluidity-money/fluidity-app/common/ethereum/aave"
	"github.com/fluidity-money/fluidity-app/common/ethereum/fluidity"
	uniswap_anchored_view "github.com/fluidity-money/fluidity-app/common/ethereum/uniswap-anchored-view"

	ethCommon "github.com/ethereum/go-ethereum/common"
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
)

const (
	// EnvEthereumHttpAddress to connect to to access Geth
	EnvEthereumHttpAddress = `FLU_ETHEREUM_HTTP_URL`

	// EnvTokenBackend is `compound` if all tokens are compound based,
	// `aave` if aave based, or empty if token-dependent (specified in tokensList)
	EnvTokenBackend = `FLU_ETHEREUM_TOKEN_BACKEND`

	// EnvTokensList to use to identify Fluidity f token addresses, their name
	// and their decimal places
	EnvTokensList = `FLU_ETHEREUM_TOKENS_LIST`

	// EnvUniswapAnchoredViewAddress to use to use the Uniswap price oracle to
	// get the price the token when making the prize pool
	EnvUniswapAnchoredViewAddress = `FLU_ETHEREUM_UNISWAP_ANCHORED_VIEW_ADDR`

	// EnvAaveAddressProviderAddress to find aave related addresses
	EnvAaveAddressProviderAddress = `FLU_ETHEREUM_AAVE_ADDRESS_PROVIDER_ADDR`

	// EnvUsdTokenAddress to use to get the price of eth from aave
	EnvUsdTokenAddress = `FLU_ETHEREUM_USD_TOKEN_ADDR`

	// WorkerPoolAmount to have running as goroutines to send work to
	WorkerPoolAmount = 30
)

func main() {
	var (
		gethAddress                 = util.GetEnvOrFatal(EnvEthereumHttpAddress)
		tokensList_                 = util.GetEnvOrFatal(EnvTokensList)
		tokenBackend                = os.Getenv(EnvTokenBackend)
		uniswapAnchoredViewAddress_ = os.Getenv(EnvUniswapAnchoredViewAddress)
		aaveAddressProviderAddress_ = os.Getenv(EnvAaveAddressProviderAddress)
		usdTokenAddress_            = os.Getenv(EnvUsdTokenAddress)
	)

	var (
		uniswapAnchoredViewAddressEth ethCommon.Address
		aaveAddressProviderAddressEth ethCommon.Address
		usdTokenAddressEth            ethCommon.Address

		isCompound = false
		isAave     = false
	)

	// getGethConnection, causing Fatal to trigger if we don't succeed.

	gethClient := getGethClient(gethAddress)

	switch tokenBackend {
	case BackendCompound:
		isCompound = true

	case BackendAave:
		isAave = true

	case "":
	}

	// tokensList will Fatal if bad input

	tokenDetails := ethereum.GetTokensListEthereum(tokensList_)

	for i, token := range tokenDetails {

		switch backend := token.Backend; backend {

		case "":
			// not set globally
			if tokenBackend == "" {
				log.Fatal(func(k *log.Log) {
					k.Format(
						"Token backend for option %v at position %d was empty!",
						backend,
						i,
					)
				})
			}
			tokenDetails[i].Backend = tokenBackend

		case BackendCompound:
			isCompound = true

		case BackendAave:
			isAave = true
		}
	}

	if isCompound {
		uniswapAnchoredViewAddressEth = ethCommon.HexToAddress(uniswapAnchoredViewAddress_)
	}

	if isAave {
		aaveAddressProviderAddressEth = ethCommon.HexToAddress(aaveAddressProviderAddress_)
		usdTokenAddressEth = ethCommon.HexToAddress(usdTokenAddress_)
	}

	var (
		workChan = make(chan ethereum.TokenDetailsEthereum, 0)
		doneChan = make(chan ethereum.TokenDetailsEthereum, 0)
	)

	for i := 0; i < WorkerPoolAmount; i++ {
		go func() {
			for work := range workChan {

				var (
					address       = work.Address
					fluidAddress  = work.FluidAddress
					tokenName     = work.TokenName
					tokenDecimals = work.TokenDecimals
					tokenBackend  = work.Backend

					tokenPrice *big.Rat
					err        error
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
						aaveAddressProviderAddressEth,
						address,
						usdTokenAddressEth,
					)
				case BackendAurora:
					tokenPrice, err = flux.GetPrice(
						gethClient,
						address,
					)

					// flux has a different number of decimal places
					tokenDecimals, err = flux.GetDecimals(
						gethClient,
						address,
					)
				}

				if err != nil {
					log.Fatal(func(k *log.Log) {
						k.Format(
							"Failed to get the current exchange rate for %#v with address %#v at %#v!",
							tokenName,
							uniswapAnchoredViewAddressEth,
							aaveAddressProviderAddressEth,
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

				tokenDetailsComplete := ethereum.TokenDetailsEthereum{
					FluidAddress:  fluidAddress,
					TokenName:     tokenName,
					TokenDecimals: tokenDecimals,
					Amount:        prizePoolFloat,
					Address:       address,
				}

				doneChan <- tokenDetailsComplete
			}
		}()
	}

	// we don't actually care about the block state!

	ethereumQueue.BlockHeaders(func(_ ethereumQueue.BlockHeader) {

		var amount float64

		for _, tokenDetail := range tokenDetails {
			workChan <- tokenDetail
		}

		for range tokenDetails {
			tokenDetails := <-doneChan

			amount += tokenDetails.Amount
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
