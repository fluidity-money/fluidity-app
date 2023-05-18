// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package main

import (
	"context"
	"math"
	"math/big"
	"time"

	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/ethclient"
	libEthereum "github.com/fluidity-money/fluidity-app/common/ethereum"
	ethereumApps "github.com/fluidity-money/fluidity-app/common/ethereum/applications"
	database "github.com/fluidity-money/fluidity-app/lib/databases/timescale/lootboxes"
	user_actions "github.com/fluidity-money/fluidity-app/lib/databases/timescale/user-actions"
	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/queue"
	lootboxes_queue "github.com/fluidity-money/fluidity-app/lib/queues/lootboxes"
	winners_queue "github.com/fluidity-money/fluidity-app/lib/queues/winners"
	"github.com/fluidity-money/fluidity-app/lib/types/applications"
	"github.com/fluidity-money/fluidity-app/lib/types/ethereum"
	"github.com/fluidity-money/fluidity-app/lib/types/lootboxes"
	"github.com/fluidity-money/fluidity-app/lib/types/misc"
	"github.com/fluidity-money/fluidity-app/lib/types/worker"
	"github.com/fluidity-money/fluidity-app/lib/util"
)

const (
	// EnvTokensList to relate the received token names to a contract address
	// of the form ADDR1:TOKEN1:DECIMALS1,ADDR2:TOKEN2:DECIMALS2,...
	EnvTokensList = "FLU_ETHEREUM_TOKENS_LIST"
	// EnvGethHttpUrl to use when performing RPC requests
	EnvGethHttpUrl = `FLU_ETHEREUM_HTTP_URL`
)

func main() {
	var (
		ethereumTokensList_ = util.GetEnvOrFatal(EnvTokensList)
		gethHttpUrl         = util.GetEnvOrFatal(EnvGethHttpUrl)

		volume misc.BigInt
	)

	tokensList := util.GetTokensListBase(ethereumTokensList_)

	// tokensMap to look up a token's address using its short name
	tokensMap := make(map[string]common.Address)
	for _, token := range tokensList {
		var (
			tokenAddress = token.TokenAddress
			tokenName    = token.TokenName
		)

		tokensMap[tokenName] = common.HexToAddress(tokenAddress)
	}

	ethClient, err := ethclient.Dial(gethHttpUrl)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Message = "Failed to connect to Geth Websocket!"
			k.Payload = err
		})
	}

	defer ethClient.Close()

	winners_queue.WinnersEthereum(func(winner winners_queue.Winner) {
		var (
			network           = winner.Network
			transactionHash   = winner.SendTransactionHash
			winnerAddress     = winner.WinnerAddress
			awardedTime       = winner.AwardedTime
			tokenDetails      = winner.TokenDetails
			rewardTier        = winner.RewardTier
			applicationString = winner.Application
			logIndex          = winner.SendTransactionLogIndex

			tokenDecimals  = tokenDetails.TokenDecimals
			tokenShortName = tokenDetails.TokenShortName
		)

		// don't track fluidification
		if winner.RewardType != "send" {
			log.Debug(func(k *log.Log) {
				k.Format(
					"Winner %s in transaction %s is a recipient, skipping!",
					winnerAddress,
					transactionHash,
				)
			})
			return
		}

		// all applications qualify, including a regular send (ApplicationNone)
		application, err := applications.ParseApplicationName(applicationString)

		if err != nil {
			log.Fatal(func(k *log.Log) {
				k.Message = "Failed to parse application name!"
				k.Payload = err
			})
		}

		sendTransaction := user_actions.GetUserActionByLogIndex(network, transactionHash, logIndex)

		if sendTransaction == nil {
			// not a Transfer event, so look up and classify the application used

			// fetch parameters to call GetApplicationFee
			receipt, err := libEthereum.GetReceipt(ethClient, ethereum.HashFromString(transactionHash))

			if err != nil {
				log.Fatal(func(k *log.Log) {
					k.Format(
						"Failed to fetch receipt for transaction %s!",
						transactionHash,
					)

					k.Payload = err
				})
			}

			if len(receipt.Logs) < int(logIndex.Int64()) {
				log.Fatal(func(k *log.Log) {
					k.Format(
						"Not enough logs to look up by log index! Expected at least %v, got %v!",
						logIndex.String(),
						len(receipt.Logs),
					)
				})
			}

			log_ := receipt.Logs[logIndex.Int64()]

			applicationTransfer := worker.EthereumApplicationTransfer{
				TransactionHash: ethereum.HashFromString(transactionHash),
				Log: log_,
				Application: application,
			}

			fluidTokenContract := tokensMap[tokenShortName]
			
			transaction, _, err := ethClient.TransactionByHash(context.Background(), common.HexToHash(transactionHash))

			if err != nil {
				log.Fatal(func(k *log.Log) {
					k.Format(
						"Failed to fetch transaction %s!",
						transactionHash,
					)

					k.Payload = err
				})
			}

			inputData := transaction.Data()

			feeData, _, err := ethereumApps.GetApplicationFee(applicationTransfer, ethClient, fluidTokenContract, tokenDecimals, *receipt, inputData)

			if err != nil {
				log.Fatal(func(k *log.Log) {
					k.Format(
						"Failed to get fee data for transaction %s!",
						transactionHash,
					)

					k.Payload = err
				})
			}

			// volume is a uint256, so no denom
			volume = misc.NewBigIntFromInt(*feeData.Volume.Num())
		} else {
			volume = sendTransaction.Amount
		}

		// Calculate lootboxes earned from transaction
		// ((volume / (10 ^ token_decimals)) / 3) + calculate_a_y(address, awarded_time)) * protocol_multiplier(ethereum_application) / 100
		lootboxCount := new(big.Rat).Mul(
			volumeLiquidityMultiplier(
				volume,
				tokenDetails.TokenDecimals,
				winnerAddress,
				awardedTime,
			),
			protocolMultiplier(application),
		)

		lootboxCountFloat, exact := lootboxCount.Float64()

		if exact != true {
			log.Debug(func(k *log.Log) {
				k.Format(
					"Lootbox count for hash %v and winner %v was not an exact float, was %v",
					transactionHash,
					winnerAddress,
					lootboxCount.String(),
				)
			})
		}

		lootbox := lootboxes_queue.Lootbox{
			Address:         winnerAddress,
			Source:          lootboxes.Transaction,
			TransactionHash: transactionHash,
			AwardedTime:     awardedTime,
			Volume:          volume,
			RewardTier:      rewardTier,
			LootboxCount:    lootboxCountFloat,
			Application:     application,
		}

		queue.SendMessage(lootboxes_queue.TopicLootboxes, lootbox)
	})
}

func volumeLiquidityMultiplier(volume misc.BigInt, tokenDecimals int, address string, time time.Time) *big.Rat {
	volumeLiquidityNum := new(big.Rat).SetInt(&volume.Int)

	tokenDecimalsRat := new(big.Rat).SetFloat64(math.Pow10(tokenDecimals) * 3)
	volumeLiquidityDenom := new(big.Rat).Inv(tokenDecimalsRat)

	volumeLiquidityRat := new(big.Rat).Mul(volumeLiquidityNum, volumeLiquidityDenom)

	liquidityMultiplier := new(big.Rat).SetFloat64(database.Calculate_A_Y(address, time))

	volumeLiquidityMultiplier := new(big.Rat).Add(volumeLiquidityRat, liquidityMultiplier)

	return volumeLiquidityMultiplier
}

func protocolMultiplier(application applications.Application) *big.Rat {
	switch application.String() {
	case "uniswap_v2":
		fallthrough
	case "uniswap_v3":
		fallthrough
	case "saddle":
		fallthrough
	case "curve":
		fallthrough
	case "camelot":
		fallthrough
	case "chronos":
		return big.NewRat(2, 100)
	}

	return big.NewRat(1, 300)
}
