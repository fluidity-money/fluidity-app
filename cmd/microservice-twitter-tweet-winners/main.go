// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package main

import (
	"context"
	"math/big"

	"github.com/ethereum/go-ethereum/ethclient"
	ethCommon "github.com/ethereum/go-ethereum/common"

	"github.com/fluidity-money/fluidity-app/lib/databases/timescale/user-actions"
	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/queues/winners"
	"github.com/fluidity-money/fluidity-app/lib/util"
	"github.com/fluidity-money/fluidity-app/common/twitter"
)

// EnvEthereumHttpUrl is the url to use to connect to the HTTP geth endpoint
const EnvEthereumHttpUrl = `FLU_ETHEREUM_HTTP_URL`

// WinningAmountThreshold to compare that it exceeded before tweeting
// about a winner
const WinningAmountThreshold = 1

func main() {
	ethereumHttpAddress := util.PickEnvOrFatal(EnvEthereumHttpUrl)

	ethClient, err := ethclient.Dial(ethereumHttpAddress)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Message = "Failed to dial into Geth!"
			k.Payload = err
		})
	}

	winningAmountThreshold := new(big.Rat).SetInt64(WinningAmountThreshold)

	winners.WinnersEthereum(func(winner winners.Winner) {
		var (
			transactionHash         = winner.TransactionHash
			winnerAddress           = winner.WinnerAddress
			sendTransactionLogIndex = winner.SendTransactionLogIndex
			network_                = winner.Network
		)

		userAction := user_actions.GetUserActionByLogIndex(
			network_,
			transactionHash,
			sendTransactionLogIndex,
		)

		var (
			tokenName     = userAction.TokenDetails.TokenShortName
			tokenDecimals = userAction.TokenDetails.TokenDecimals

			senderAddress_    = userAction.SenderAddress
			recipientAddress_ = userAction.RecipientAddress
		)

		// adjust the amount consumed in the transfer and the amount won to be
		// human readable

		amountSent := new(big.Rat).SetInt(&userAction.Amount.Int)

		amountSent.Quo(amountSent, pow10(tokenDecimals))

		winningAmount := new(big.Rat).SetInt(&winner.WinningAmount.Int)

		winningAmount.Quo(winningAmount, pow10(tokenDecimals))

		// if the sender is not the winner, we assume this is a dupe and ignore

		// check if both sides are a contract, so we can tweet about it properly

		if winnerAddress != senderAddress_ {
			log.Debug(func(k *log.Log) {
				k.Format(
					"Winning transaction %v had the same winner (%v) as the sender, not tweeting",
					transactionHash,
					winnerAddress,
				)
			})

			return
		}

		var (
			senderAddress    = ethCommon.HexToAddress(senderAddress_)
			recipientAddress = ethCommon.HexToAddress(recipientAddress_)
		)

		// if the amount is below a dollar, don't tweet it

		if winningAmount.Cmp(winningAmountThreshold) >= 1 {
			log.Debug(func(k *log.Log) {
				k.Format(
					"Winning transaction %v had a lower winning amount (%v) than %v, not tweeting",
					transactionHash,
					winningAmount.FloatString(2),
					WinningAmountThreshold,
				)
			})

			return
		}

		senderCode, err := ethClient.CodeAt(context.Background(), senderAddress, nil)

		if err != nil {
			log.Fatal(func(k *log.Log) {
				k.Format(
					"Failed to look up the code of the sender %#v for transaction hash %v!",
					senderAddress,
					transactionHash,
				)

				k.Payload = err
			})
		}

		isSenderAContract := len(senderCode) == 0

		if isSenderAContract {
			log.Debug(func(k *log.Log) {
				k.Format(
					"Sender (%v) in transaction hash %v is a contract!",
					senderAddress,
					transactionHash,
				)
			})
		}

		recipientCode, err := ethClient.CodeAt(context.Background(), recipientAddress, nil)

		if err != nil {
			log.Fatal(func(k *log.Log) {
				k.Format(
					"Failed to look up the code of the recipient %#v for transaction hash %v!",
					recipientAddress,
					transactionHash,
				)

				k.Payload = err
			})
		}

		isRecipientAContract := len(recipientCode) == 0

		if isRecipientAContract {
			log.Debug(func(k *log.Log) {
				k.Format(
					"Receiver (%v) in transaction hash %v is a contract!",
					senderAddress,
					transactionHash,
				)
			})
		}

		var tweetMessage string

		switch true {
		case !isSenderAContract && isRecipientAContract:
			tweetMessage, err = prepareTweetRecipientIsContract(
				arbiscanKey,
				senderAddress,
				recipientAddress,
			)

			if err != nil {
				log.Fatal(func(k *log.Log) {
					k.Format(
						"Failed to look up recipient address (%v) via Arbiscan!",
						recipientAddress,
					)

					k.Payload = err
				})
			}

		case !isSenderAContract && !isRecipientAContract:
			tweetMessage = formatTweetSenderReceiver(
				senderAddress,
				recipientAddress,
				tokenName,
			)

		default:
			log.App(func(k *log.Log) {
				k.Format(
					"Ignoring win since sender (%v) and recipient (%v) are both contracts!",
					senderAddress,
					recipientAddress,
				)
			})

			return
		}

		tweetId := twitter.SendTweet(tweetMessage, "")

		log.App(func(k *log.Log) {
			k.Format(
				"Sent Tweet for transaction hash %v, sender %v, recipient %v",
				transactionHash,
				senderAddress,
				recipientAddress,
			)

			k.Payload = tweetId
		})
	})
}
