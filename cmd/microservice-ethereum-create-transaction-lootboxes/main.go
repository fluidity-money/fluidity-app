// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package main

import (
	"strconv"
	"time"
	"math/big"

	database "github.com/fluidity-money/fluidity-app/lib/databases/timescale/lootboxes"
	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/queue"
	lootboxes_queue "github.com/fluidity-money/fluidity-app/lib/queues/lootboxes"
	user_actions_queue "github.com/fluidity-money/fluidity-app/lib/queues/user-actions"
	"github.com/fluidity-money/fluidity-app/lib/types/lootboxes"
	"github.com/fluidity-money/fluidity-app/lib/types/network"
	"github.com/fluidity-money/fluidity-app/lib/util"

	//"github.com/fluidity-money/fluidity-app/common/ethereum/uniswap_v3"
	"github.com/fluidity-money/fluidity-app/common/ethereum/applications"

	ethCommon "github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/ethclient"
)

const (
	// EnvTokensList to relate the received token names to a contract address
	// of the form ADDR1:TOKEN1:DECIMALS1:MULTIPLIER,ADDR2:TOKEN2:DECIMALS2:MULTIPLIER,<UNISWAP V3 >?...
	EnvTokensList = "FLU_ETHEREUM_TOKENS_LIST"

	// EnvGethHttpUrl to use when performing RPC requests
	EnvGethHttpUrl = `FLU_ETHEREUM_HTTP_URL`
)

func main() {
	var (
		ethereumTokensList_ = util.GetEnvOrFatal(EnvTokensList)
		gethHttpUrl         = util.PickEnvOrFatal(EnvGethHttpUrl)
	)

	log.Debugf("Running with tokens list %v", ethereumTokensList_)

	tokensList := util.GetTokensListBase(ethereumTokensList_)

	// customMultipliers for every tokenName that are applied to every calculation to
	// determine points
	customMultipliers := make(map[string]int, len(tokensList))

	// tokensMap to look up a token's address using its short name
	tokensMap := make(map[string]ethCommon.Address)

	// oraclesMap to optionally use to look up a token price using Uniswap's TWAP oracle.
	// Can be unset, and if is unset, then assumes the underlying volume is USD priced.
	oraclesMap := make(map[string]ethCommon.Address)

	for i, token := range tokensList {
		var (
			tokenAddress = token.TokenAddress

			// tokenName should be the same as tokenShortName
			tokenName    = token.TokenName
		)

		switch len(token.Extras) {
		case 0:
			log.Fatal(func(k *log.Log) {
				k.Format(
					"Extra multiplier not provided for argument %v!",
					i,
				)
			})

		// if the second parameter is set in the extras fields, enable a oracle token map
		case 2:
			oracle := token.Extras[1]

			if !ethCommon.IsHexAddress(oracle) {
				log.Fatal(func(k *log.Log) {
					k.Format(
						"Oracle not formatted being provided as an argument %v!",
						i,
					)
				})
			}

			oraclesMap[tokenName] = ethCommon.HexToAddress(oracle)

			fallthrough

		default:
			var err error

			customMultipliers[tokenName], err = strconv.Atoi(token.Extras[0])

			if err != nil {
				log.Fatal(func(k *log.Log) {
					k.Format(
						"Failed to parse extra multiplier position %v!",
						i,
					)

					k.Payload = err
				})
			}

			tokensMap[tokenName] = ethCommon.HexToAddress(tokenAddress)
		}
	}

	ethClient, err := ethclient.Dial(gethHttpUrl)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Message = "Failed to connect to Geth Websocket!"
			k.Payload = err
		})
	}

	defer ethClient.Close()

	user_actions_queue.UserActionsEthereum(func(userAction user_actions_queue.UserAction) {
		programFound, hasBegun, currentEpoch, _ := database.GetLootboxConfig()

		// check that the lootbox is enabled, and that it's also
		// running. logs separately if either fail. if the
		// campaign has begun but isn't in progress, then we
		// should die! that means that something was processed
		// weirdly.

		switch false {
		case programFound:
			log.App(func(k *log.Log) {
				k.Message = "No lootbox epoch found, skipping a request to track a winner!"
			})

			return

		case hasBegun:
			log.Fatal(func(k *log.Log) {
				k.Message = "Lootbox epoch that was found is not running! Terminating on request to track a winner!"
			})

			return
		}

		var (
			network_        = userAction.Network
			transactionHash = userAction.TransactionHash
			tokenDetails    = userAction.TokenDetails
			application_    = userAction.Application
			senderAddress   = userAction.SenderAddress
			amount          = userAction.Amount
		)

		var (
			tokenShortName = tokenDetails.TokenShortName
			tokenDecimals = tokenDetails.TokenDecimals
		)

		switch network_ {
		case network.NetworkEthereum, network.NetworkArbitrum:
			// do nothing

		default:
			log.App(func(k *log.Log) {
				k.Format(
					"Network %v isn't supported for transaction lootboxes!",
					network_,
				)
			})

			return
		}

		if _, found := tokensMap[tokenShortName]; !found {
			log.Debugf(
				"For transaction hash %v, had a user action with token short name %v that wasn't in the tokens list. Ignoring",
				transactionHash,
				tokenShortName,
			)

			return
		}

		// don't track fluidification
		if userAction.Type != "send" {
			log.Debug(func(k *log.Log) {
				k.Format(
					"Winner %s in transaction %s is a recipient, skipping!",
					senderAddress,
					transactionHash,
				)
			})
			return
		}

		application, err := applications.ParseApplicationName(application_)

		if err != nil {
			log.Fatal(func(k *log.Log) {
				k.Format(
					"Failed to parse application name %s!",
					application_,
				)

				k.Payload = err
			})
		}

		if !protocolAllowed(application) {
			log.App(func(k *log.Log) {
				k.Format(
					"Application is none for transaction hash %v, tracked existing send transaction amount is %v. Skipping!",
					transactionHash,
					amount,
				)
			})

			return
		}

		tokenDecimalsExp := new(big.Int).SetInt64(int64(tokenDecimals))

		tokenDecimalsExp.Exp(tokenDecimalsExp, new(big.Int).SetInt64(10), nil)

		normalisedAmount := new(big.Rat).SetInt(&amount.Int)

		normalisedAmount.Quo(normalisedAmount, new(big.Rat).SetInt(tokenDecimalsExp))

		// for the asset, the price 1 is assumed to be the case, unless the pool is set for a lookup

		amountUsd := new(big.Rat).SetInt64(1)

		_, ok := oraclesMap[tokenShortName]

		// if we can find a pool using the oracle map, then let's look up the price instead of using the default

		if ok {
			// this will die using Fatal if the lookup fails
			//amountUsd = uniswap_v3.GetTwrpPrice1Second(ethClient, uniswapV3PoolAddr)
			amountUsd, _ = new(big.Rat).SetString("0.04636")
		}

		// multiply the usd price with the normalisedAmount to get the USD amount that was sent

		amountUsd.Mul(amountUsd, normalisedAmount)

		awardedTime := time.Now()

		customMultiplier := customMultipliers[tokenShortName]

		log.Debugf(
			"Ttransaction hash %v, tracked existing send transaction amount is %v, usd amount %v",
			transactionHash,
			amount,
			amountUsd,
		)

		// calculate lootboxes earned from transaction

		lootboxCount := new(big.Rat).Quo(amountUsd, new(big.Rat).SetInt64(3))

		lootboxCount.Mul(lootboxCount, new(big.Rat).SetInt64(int64(customMultiplier)))

		lootboxRewardTier := pickRandomNumber()

		if lootboxRewardTier == 0 {
			log.App(func(k *log.Log) {
				k.Format(
					"Ttransaction hash %v, tracked existing send transaction amount is %v, usd amount %v, didn't win any bottles!",
					transactionHash,
					amount,
					amountUsd,
				)
			})

			return
		}

		log.App(func(k *log.Log) {
			k.Format(
				"Creating a lootbox for transaction %v the volume %v, application %v as the inputs. Has lootbox count %v, lootboxRewardTier %v",
				transactionHash,
				amountUsd,
				application,
				lootboxCount,
				lootboxRewardTier,
			)
		})

		lootboxCountFloat, _ := lootboxCount.Float64()

		lootbox := lootboxes_queue.Lootbox{
			Address:         senderAddress,
			Source:          lootboxes.Transaction,
			TransactionHash: transactionHash,
			AwardedTime:     awardedTime,
			Volume:          amount,
			RewardTier:      lootboxRewardTier,
			LootboxCount:    lootboxCountFloat,
			Application:     application,
			Epoch:           currentEpoch,
		}

		database.UpdateOrInsertAmountsRewarded(
			network_,
			currentEpoch,
			tokenShortName,
			lootboxCountFloat,
			senderAddress,
			application_,
		)

		queue.SendMessage(lootboxes_queue.TopicLootboxes, lootbox)
	})
}

func protocolAllowed(application applications.Application) bool {
	switch application {
	case applications.ApplicationUniswapV3, applications.ApplicationTraderJoe, applications.ApplicationCamelotV3, applications.ApplicationJumper:
		return true
	default:
		return false
	}
}
