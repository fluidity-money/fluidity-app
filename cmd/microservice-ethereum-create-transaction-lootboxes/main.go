// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package main

import (
	"context"
	"math"
	"math/big"

	database "github.com/fluidity-money/fluidity-app/lib/databases/timescale/lootboxes"
	user_actions "github.com/fluidity-money/fluidity-app/lib/databases/timescale/user-actions"
	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/queue"
	lootboxes_queue "github.com/fluidity-money/fluidity-app/lib/queues/lootboxes"
	winners_queue "github.com/fluidity-money/fluidity-app/lib/queues/winners"
	"github.com/fluidity-money/fluidity-app/lib/types/ethereum"
	"github.com/fluidity-money/fluidity-app/lib/types/lootboxes"
	"github.com/fluidity-money/fluidity-app/lib/types/misc"
	"github.com/fluidity-money/fluidity-app/lib/types/worker"
	"github.com/fluidity-money/fluidity-app/lib/util"

	libEthereum "github.com/fluidity-money/fluidity-app/common/ethereum"
	"github.com/fluidity-money/fluidity-app/common/ethereum/applications"

	"github.com/ethereum/go-ethereum/accounts/abi/bind"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/ethclient"
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
		gethHttpUrl         = util.PickEnvOrFatal(EnvGethHttpUrl)

		volumeBigInt misc.BigInt
		volume       *big.Rat
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

		if tokenShortName != "USDC" {
			log.App(func(k *log.Log) {
				k.Format(
					"Ignoring NON USDC winner that has transaction hash %v, winner address %v, token short name %v, token decimals %v, reward tier %v, application string %v",
					transactionHash,
					winnerAddress,
					tokenShortName,
					tokenDecimals,
					rewardTier,
					applicationString,
				)
			})

			return
		}

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

		log.Debugf("Lootbox current epoch running is %v!", currentEpoch)

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
			// wait for transaction to be mined before fetching receipt

			transaction, isPending, err := ethClient.TransactionByHash(
				context.Background(),
				common.HexToHash(transactionHash),
			)

			if err != nil {
				log.Fatal(func(k *log.Log) {
					k.Format(
						"Failed to fetch transaction by hash %s!",
						transactionHash,
					)

					k.Payload = err
				})
			}

			if isPending {
				log.Debug(func(k *log.Log) {
					k.Format(
						"Transaction %s is pending - waiting to be mined",
						transactionHash,
					)
				})
			}

			receipt_, err := bind.WaitMined(context.Background(), ethClient, transaction)

			if err != nil {
				log.Fatal(func(k *log.Log) {
					k.Format(
						"Failed to fetch receipt for transaction %s!",
						transactionHash,
					)

					k.Payload = err
				})
			}

			receipt := libEthereum.ConvertGethReceipt(*receipt_)

			// look up log by index
			var logIndexInReceipt int
			for i, receipt := range receipt.Logs {
				if receipt.Index.Int64() == logIndex.Int64() {
					logIndexInReceipt = i
					break
				}
			}

			log_ := receipt.Logs[logIndexInReceipt]

			applicationTransfer := worker.EthereumApplicationTransfer{
				TransactionHash: ethereum.HashFromString(transactionHash),
				Log:             log_,
				Application:     application,
			}

			fluidTokenContract := tokensMap[tokenShortName]

			inputData := transaction.Data()

			feeData, _, _, err := applications.GetApplicationFee(
				applicationTransfer,
				ethClient,
				fluidTokenContract,
				tokenDecimals,
				receipt,
				inputData,
			)

			if err != nil {
				log.Fatal(func(k *log.Log) {
					k.Format(
						"Failed to get fee data for transaction %s!",
						transactionHash,
					)

					k.Payload = err
				})
			}

			feeDataVolume := feeData.Volume

			if feeDataVolume == nil {
				log.Fatal(func(k *log.Log) {
					k.Format(
						"Fee data volume for send transaction %v, winner transaction hash %v is nil!",
						sendTransaction.TransactionHash,
						transactionHash,
					)
				})
			}

			//

			volume = new(big.Rat).Set(feeDataVolume)

			// volumeBigInt_ to convert to the database BigInt
			// volumeBigInt_ = (volumeRat * 10^decimals * denominator)::BigInt / denominator
			// this is to convert to a BigInt without losing decimal places that are relevant to the token amount
			// e.g. 1234567/100000 with 6 decimals should be adjusted to 12345670
			volumeBigInt_ := new(big.Rat).Set(feeDataVolume)

			decimalsAdjusted := math.Pow10(tokenDecimals)
			decimalsRat := new(big.Rat).SetFloat64(decimalsAdjusted)

			// get denominator
			denom := new(big.Int).Set(volumeBigInt_.Denom())
			// multiply by decimals
			volumeBigInt_ = volumeBigInt_.Mul(volumeBigInt_, decimalsRat)
			// multiply by denom to get number as an int
			volumeBigInt_ = volumeBigInt_.Mul(volumeBigInt_, new(big.Rat).SetInt(denom))
			// convert to int
			volumeBigIntNum := volumeBigInt_.Num()

			// divide by original denom, losing any extra precision
			volumeBigIntNum = volumeBigIntNum.Quo(volumeBigIntNum, denom)
			volumeBigInt = misc.NewBigIntFromInt(*volumeBigIntNum)

		} else {
			volumeBigInt = sendTransaction.Amount
			// adjust to USD
			volume = new(big.Rat).SetInt(&sendTransaction.Amount.Int)
			decimalsAdjusted := math.Pow10(tokenDecimals)
			decimalsRat := new(big.Rat).SetFloat64(decimalsAdjusted)
			volume = volume.Quo(volume, decimalsRat)
		}

		three := big.NewRat(3, 1)

		log.App(func(k *log.Log) {
			k.Format(
				"Creating a lootbox for transaction %v the volume %v, application %v as the inputs...",
				transactionHash,
				volume,
				application,
			)
		})

		// Calculate lootboxes earned from transaction
		// ((volume) / 3) * protocol_multiplier(ethereum_application)
		lootboxCount := new(big.Rat).Mul(
			new(big.Rat).Quo(volume, three),
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
			Volume:          volumeBigInt,
			RewardTier:      rewardTier,
			LootboxCount:    lootboxCountFloat,
			Application:     application,
			Epoch:           currentEpoch,
		}

		queue.SendMessage(lootboxes_queue.TopicLootboxes, lootbox)
	})
}

func protocolMultiplier(application applications.Application) *big.Rat {
	//switch application {
	//case applications.ApplicationJumper, applications.ApplicationUniswapV3, applications.ApplicationTraderJoe, applications.ApplicationCamelot, applications.ApplicationSushiswap, applications.ApplicationRamses:
	//	return big.NewRat(2, 100)
	//}

	return big.NewRat(1, 20)
}
