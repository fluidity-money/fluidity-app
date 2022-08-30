// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package main

import (
	"math/big"
	"time"

	"github.com/fluidity-money/fluidity-app/common/solana"
	"github.com/fluidity-money/fluidity-app/common/solana/prize-pool"
	"github.com/fluidity-money/fluidity-app/common/solana/pyth"
	"github.com/fluidity-money/fluidity-app/common/solana/rpc"
	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/queue"
	prize_pool_queue "github.com/fluidity-money/fluidity-app/lib/queues/prize-pool"
	"github.com/fluidity-money/fluidity-app/lib/types/network"
	"github.com/fluidity-money/fluidity-app/lib/util"

	solanaGo "github.com/fluidity-money/fluidity-app/common/solana"
)

const (
	// EnvSolanaRpcUrl is the RPC url of the solana node to connect to
	EnvSolanaRpcUrl = `FLU_SOLANA_RPC_URL`

	// EnvUpdateInterval is the interval between each prize pool update
	EnvUpdateInterval = `FLU_SOLANA_PRIZE_POOL_UPDATE_TIME`

	// EnvFluidityPubkey is the program id of the fluidity program
	EnvFluidityPubkey = `FLU_SOLANA_PROGRAM_ID`

	// EnvTvlDataPubkey is the public key of an initialized account for storing TVL data
	EnvTvlDataPubkey = `FLU_SOLANA_TVL_DATA_PUBKEY`

	// EnvSolendPubkey is the program id of the solend program
	EnvSolendPubkey = `FLU_SOLANA_SOLEND_PROGRAM_ID`

	// EnvPayerPrikey is a private key of an account that holds solana funds
	// this program doesn't alter onchain state, and thus won't actually spend anything
	EnvPayerPrikey = `FLU_SOLANA_TVL_PAYER_PRIKEY`

	// EnvTokensList to use to identify Fluidity f token addresses, their name,
	// their decimal places, and their associated Solend keys
	EnvTokensList = `FLU_SOLANA_TOKENS_LIST`

	// WorkerPoolAmount to have running as goroutines to send work to
	WorkerPoolAmount = 30
)

// pubkeyFromEnv gets and decodes a solana public key from an environment variable,
// panicking if the env doesn't exist or isn't a valid key
func pubkeyFromEnv(env string) solanaGo.PublicKey {
	pubkeyString := util.GetEnvOrFatal(env)

	pubkey, err := solanaGo.PublicKeyFromBase58(pubkeyString)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Format(
				"Failed to decode public key %s",
				env,
			)

			k.Payload = err
		})
	}

	return pubkey
}

func getPrizePool(solanaClient *rpc.Provider, fluidityPubkey, fluidMintPubkey, tvlDataPubkey, solendPubkey, obligationPubkey, reservePubkey, pythPubkey, switchboardPubkey solanaGo.PublicKey, payer *solanaGo.Wallet) *big.Rat {
	tvl, err := prize_pool.GetTvl(
		solanaClient,
		fluidityPubkey,
		tvlDataPubkey,
		solendPubkey,
		obligationPubkey,
		reservePubkey,
		pythPubkey,
		switchboardPubkey,
		payer,
	)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Format(
				"Failed to get TVL! %v",
				err,
			)
		})
	}

	mintSupply, err := prize_pool.GetMintSupply(
		solanaClient,
		fluidMintPubkey,
	)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Format(
				"Failed to get mint supply! %v",
				err,
			)
		})
	}

	if mintSupply > tvl {
		log.Fatal(func(k *log.Log) {
			k.Format(
				"Got a mint supply that was higher than our tvl! %d > %d",
				mintSupply,
				tvl,
			)
		})
	}

	prizePool := int64(tvl - mintSupply)

	log.Debug(func(k *log.Log) {
		k.Format(
			"Got TVL %d, supply %d, unscaled prize pool %d, for pubkey %v",
			tvl,
			mintSupply,
			prizePool,
			fluidMintPubkey.String(),
		)
	})

	// return the whole amount in the unit of that token
	return big.NewRat(prizePool, 1)
}

func main() {
	var (
		solanaRpcUrl = util.PickEnvOrFatal(EnvSolanaRpcUrl)

		fluidityPubkey = pubkeyFromEnv(EnvFluidityPubkey)
		tvlDataPubkey  = pubkeyFromEnv(EnvTvlDataPubkey)
		solendPubkey   = pubkeyFromEnv(EnvSolendPubkey)

		payerPrikey    = util.GetEnvOrFatal(EnvPayerPrikey)
		updateInterval = util.GetEnvOrFatal(EnvUpdateInterval)
		tokensList_    = util.GetEnvOrFatal(EnvTokensList)
	)

	// tokensList will Fatal if bad input

	tokenDetails := solana.GetTokensListSolana(tokensList_)

	rpcClient, err := rpc.New(solanaRpcUrl)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Message = "Failed to create the Solana RPC client!"
			k.Payload = err
		})
	}

	payer, err := solanaGo.WalletFromPrivateKeyBase58(payerPrikey)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Message = "Failed to decode payer prikey!"
			k.Payload = err
		})
	}

	// solana has a really low blocktime, so update this on an arbitrary delay
	interval, err := time.ParseDuration(updateInterval)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Message = "Failed to read update interval!"
			k.Payload = err
		})
	}

	var (
		workChan = make(chan solana.TokenDetailsSolana, 0)
		doneChan = make(chan solana.TokenDetailsSolana, 0)
	)

	for i := 0; i < WorkerPoolAmount; i++ {
		go func() {
			for work := range workChan {

				var (
					fluidMintPubkey   = work.FluidMintPubkey
					obligationPubkey  = work.ObligationPubkey
					reservePubkey     = work.ReservePubkey
					pythPubkey        = work.PythPubkey
					switchboardPubkey = work.SwitchboardPubkey
					decimalsRat       = work.TokenDecimals
				)

				prizePool := getPrizePool(
					rpcClient,
					fluidityPubkey,
					fluidMintPubkey,
					tvlDataPubkey,
					solendPubkey,
					obligationPubkey,
					reservePubkey,
					pythPubkey,
					switchboardPubkey,
					payer,
				)

				// get the token price from Pyth
				tokenPrice, err := pyth.GetPrice(rpcClient, pythPubkey)

				if err != nil {
					log.Fatal(func(k *log.Log) {
						k.Format(
							"Failed to get token price for token with mint %v: %v",
							fluidMintPubkey,
							err,
						)
					})
				}

				// adjust for decimals
				prizePoolAdjusted := prizePool.Quo(prizePool, decimalsRat)

				// multiply the token price with the exchange rate to get it in USD...
				prizePoolAdjusted.Mul(prizePoolAdjusted, tokenPrice)

				log.Debug(func(k *log.Log) {
					k.Format(
						"Prize pool: %v, token price: %v",
						prizePoolAdjusted.FloatString(10),
						tokenPrice.FloatString(10),
					)
				})

				prizePoolFloat, _ := prizePoolAdjusted.Float64()

				tokenDetailsComplete := solana.TokenDetailsSolana{
					FluidMintPubkey:   fluidMintPubkey,
					ObligationPubkey:  obligationPubkey,
					ReservePubkey:     reservePubkey,
					PythPubkey:        pythPubkey,
					SwitchboardPubkey: switchboardPubkey,
					TokenDecimals:     decimalsRat,
					Amount:            prizePoolFloat,
				}

				doneChan <- tokenDetailsComplete
			}
		}()
	}

	timer := time.NewTicker(interval)

	for {
		select {
		case <-timer.C:
			var amount float64
			// fetch amount for each token
			for _, tokenDetail := range tokenDetails {
				workChan <- tokenDetail
			}

			// aggregate results
			for range tokenDetails {
				tokenDetails := <-doneChan
				amount += tokenDetails.Amount
			}

			prizePool := prize_pool_queue.PrizePool{
				Network:     string(network.NetworkSolana),
				Amount:      amount,
				LastUpdated: time.Now(),
			}

			log.Debug(func(k *log.Log) {
				k.Format("Publishing aggregated prize pool: %v", amount)
			})

			queue.SendMessage(
				prize_pool_queue.TopicPrizePoolSolana,
				prizePool,
			)
		}
	}
}
