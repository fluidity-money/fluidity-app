// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package main

import (
	"math"
	"time"

	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/queue"
	ethereumQueue "github.com/fluidity-money/fluidity-app/lib/queues/ethereum"
	prize_pool "github.com/fluidity-money/fluidity-app/lib/queues/prize-pool"
	"github.com/fluidity-money/fluidity-app/lib/types/network"
	"github.com/fluidity-money/fluidity-app/lib/util"

	"github.com/fluidity-money/fluidity-app/common/ethereum"
	"github.com/fluidity-money/fluidity-app/common/ethereum/fluidity"

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

	// WorkerPoolAmount to have running as goroutines to send work to
	WorkerPoolAmount = 30
)

// gets an address from the env, dying if not set
func mustAddressFromEnv(env string) ethCommon.Address {
	addressString := util.GetEnvOrFatal(env)

	address := ethCommon.HexToAddress(addressString)

	return address
}

func main() {
	var (
		gethAddress  = util.GetEnvOrFatal(EnvEthereumHttpAddress)
		tokensList_  = util.GetEnvOrFatal(EnvTokensList)
	)

	// getGethConnection, causing Fatal to trigger if we don't succeed.

	gethClient := getGethClient(gethAddress)

	// tokensList will Fatal if bad input

	tokenDetails := ethereum.GetTokensListEthereum(tokensList_)

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

					err        error
				)

				// we assume the token is always worth a dollar!

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

				log.Debug(func(k *log.Log) {
					k.Format(
						"Prize pool: %v",
						prizePoolAdjusted.FloatString(10),
					)
				})

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
