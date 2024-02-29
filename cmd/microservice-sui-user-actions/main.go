// Copyright 2023 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package main

import (
	"context"
	"math/big"
	"time"

	"github.com/block-vision/sui-go-sdk/models"
	"github.com/block-vision/sui-go-sdk/sui"
	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/queue"
	sui_queue "github.com/fluidity-money/fluidity-app/lib/queues/sui"
	user_actions "github.com/fluidity-money/fluidity-app/lib/queues/user-actions"
	"github.com/fluidity-money/fluidity-app/lib/queues/winners"
	"github.com/fluidity-money/fluidity-app/lib/types/misc"
	"github.com/fluidity-money/fluidity-app/lib/types/network"
	sui_types "github.com/fluidity-money/fluidity-app/lib/types/sui"
	token_details "github.com/fluidity-money/fluidity-app/lib/types/token-details"
	"github.com/fluidity-money/fluidity-app/lib/util"
)

const (
	EnvSuiHttpUrl    = `FLU_SUI_HTTP_URL`
	topicUserActions = user_actions.TopicUserActionsSui
)

func main() {
	var (
		suiHttpUrl = util.GetEnvOrFatal(EnvSuiHttpUrl)
	)

	var (
		httpClient = sui.NewSuiClient(suiHttpUrl)
		// TODO source fluid token from env, including decimals
		fluidToken = sui_types.SuiToken{
			PackageId:      "0xeeb05606f5e8033e807c9c86e6f60bf4225f6110d511e45d99d74a562b0a24fe",
			TokenShortName: "USDC",
			TokenDecimals:  9,
		}
	)

	sui_queue.Checkpoints(func(checkpoint sui_queue.Checkpoint) {
		// look up all digests
		blocksResponse, err := getTransactionBlocks(httpClient, checkpoint.Transactions)

		if err != nil {
			log.Fatal(func(k *log.Log) {
				k.Format(
					"Failed to fetch transaction blocks for checkpoint %v",
					checkpoint.SequenceNumber.String(),
				)
				k.Payload = err
			})
		}

		for _, response := range blocksResponse {
			var (
				objectChanges = response.ObjectChanges
				events        = response.Events
				transactions  = response.Transaction.Data.Transaction.Transactions
				inputs        = response.Transaction.Data.Transaction.Inputs
			)

			// process events
			for _, event := range events {
				transactionHash := event.Id.TxDigest

				switch event.Type {
				// TODO - ethereum doesn't assign a log index to swaps - do we need to on sui?
				case fluidToken.Wrap():
					wrapEvent, err := sui_types.ParseWrap(event.ParsedJson)
					if err != nil {
						log.Fatal(func(k *log.Log) {
							k.Message = "Failed to parse wrap event!"
							k.Payload = err
						})
					}

					swap := userActionFromWrap(transactionHash, wrapEvent, fluidToken)

					queue.SendMessage(user_actions.TopicUserActionsSui, swap)
				// TODO - ethereum doesn't seem to assign a log index to swaps - do we need to on sui?
				case fluidToken.Unwrap():
					unwrapEvent, err := sui_types.ParseUnwrap(event.ParsedJson)
					if err != nil {
						log.Fatal(func(k *log.Log) {
							k.Message = "Failed to parse unwrap event!"
							k.Payload = err
						})
					}

					swap := userActionFromUnwrap(transactionHash, unwrapEvent, fluidToken)

					queue.SendMessage(user_actions.TopicUserActionsSui, swap)
				// TODO parse win events, get application from pending winners
				// TODO use send tx log index
				case fluidToken.DistributeYield():
					distributeYieldEvent, err := sui_types.ParseDistributeYield(event.ParsedJson)
					if err != nil {
						log.Fatal(func(k *log.Log) {
							k.Message = "Failed to parse distributeYield event!"
							k.Payload = err
						})
					}

					w := winnerFromDistributeYieldEvent(transactionHash, distributeYieldEvent, fluidToken)
					queue.SendMessage(winners.TopicWinnersSui, w)
					event := sui_types.SuiEvent{DistributeYield: distributeYieldEvent}
					queue.SendMessage(sui_queue.TopicEvents, event)
				}
			}

			// process transactions in PTB
			// wrap/unwrap/yield will not be double processed as their internal calls aren't emitted like a regular transaction
			// TODO move all of this into function, move all functions in this file into separate files
			for txIndex, transaction := range transactions {
				// only interested in TransferObjects
				if transaction.TransferObjects == nil {
					continue
				}

				// has tuple type [[]{Result int}, {Input int}]
				var (
					transferObjects = transaction.TransferObjects

					transferResults = transferObjects[0]
					transferInputs  = transferObjects[1]
				)

				// find the recipient address in the inputs array
				recipientIndex := mustIntFromMapKey(transferInputs, "Input")

				recipientAddress_ := inputs[recipientIndex]["value"]
				recipientAddress := mustStringFromInterface(recipientAddress_)

				// parse either a Result or NestedResult from TransferObjects
				maybeNested_ := mustArrayFromInterface(transferResults)[0]

				// if the first value is GasCoin, this transfer is using the Sui token
				if f, ok := maybeNested_.(string); ok && f == "GasCoin" {
					log.Debug(func(k *log.Log) {
						k.Message = "First TransferObjects entry was GasCoin - skipping!"
					})
					continue
				}

				maybeNested := mustMapFromInterface(maybeNested_)

				var i, j int

				if nestedResult := maybeNested["NestedResult"]; nestedResult != nil {
					results := mustArrayFromInterface(nestedResult)

					i = mustIntFromFloat64Interface(results[0])
					j = mustIntFromFloat64Interface(results[1])
				} else if result := maybeNested["Result"]; result != nil {
					// Result(i) = NestedResult(i, 0)
					i = mustIntFromFloat64Interface(result)
					j = 0
				}

				// find the SplitCoins transaction referenced by TransferObjects
				var (
					txAtI      = transactions[i]
					splitCoins = txAtI.SplitCoins
				)

				// if SplitCoins is nil, we don't know how to parse the transfer, so skip
				if splitCoins == nil {
					log.Debug(func(k *log.Log) {
						k.Format(
							"Transaction at %v was not SplitCoins - skipping!",
							i,
						)
					})
					continue
				}

				var (
					coinArg    = splitCoins[0]
					amountArgs = splitCoins[1]
				)

				// if the first value is GasCoin, this transfer is using the Sui token
				if f, ok := coinArg.(string); ok && f == "GasCoin" {
					log.Debug(func(k *log.Log) {
						k.Message = "First SplitCoins entry was GasCoin - skipping!"
					})
					continue
				}

				// parse the SplitCoins tuple
				// find the index of the coin that was split in the inputs array
				first_ := mustMapFromInterface(coinArg)
				first := first_["Input"]
				coinArgIndex := mustIntFromFloat64Interface(first)

				// find the index of the amount transferred in the inputs array
				second_ := mustArrayFromInterface(amountArgs)
				second := second_[j]
				amountTransferredIndex := mustIntFromMapKey(second, "Input")

				// find the amount transferred in the inputs array
				// must be u64
				amountTransferred_ := inputs[amountTransferredIndex]["value"]
				amountTransferred := mustStringFromInterface(amountTransferred_)

				// find the ID of the coin that's being split in the inputs array
				splitCoinId_ := inputs[coinArgIndex]["objectId"]
				splitCoinId := mustStringFromInterface(splitCoinId_)

				var senderAddress string
				// find splitCoinId in objectChanges
				for _, objectChange := range objectChanges {
					if objectChange.ObjectId != splitCoinId {
						continue
					}

					// found the corresponding object, check that it's a fluid transfer
					if objectChange.Type == "mutated" && objectChange.ObjectType == fluidToken.ObjectType() {
						senderAddress = objectChange.Owner.AddressOwner
						break
					}
				}

				// correct object didn't exist
				if senderAddress == "" {
					log.Debug(func(k *log.Log) {
						k.Format(
							"TransferObjects in %v at %v was not a fluid transfer - skipping!",
							response.Digest,
							txIndex,
						)
					})
					continue
				}

				amountBig, _ := new(big.Int).SetString(amountTransferred, 10)
				amountInt := misc.NewBigIntFromInt(*amountBig)
				txIndexInt := misc.BigIntFromInt64(int64(txIndex))

				send := user_actions.NewSendSui(network.NetworkSui, senderAddress, recipientAddress, response.Digest, amountInt, txIndexInt, fluidToken.TokenShortName, fluidToken.TokenDecimals)

				decoratedTransfer := sui_queue.DecoratedTransfer{
					UserAction: send,
					Data:       response.Transaction.Data,
				}

				// user actions are processed by the application server to add application info
				queue.SendMessage(sui_queue.TopicDecoratedTransfers, decoratedTransfer)
			}
		}
	})
}

func mustMapFromInterface(m interface{}) map[string]interface{} {
	m_, ok := m.(map[string]interface{})

	if !ok {
		log.Fatal(func(k *log.Log) {
			k.Message = "Failed to coerce interface to map[string]interface{}!"
			k.Payload = m
		})
	}

	return m_
}

// f is an interface{} containing a float64
func mustIntFromFloat64Interface(f interface{}) int {
	f_, ok := f.(float64)

	if !ok {
		log.Fatal(func(k *log.Log) {
			k.Message = "Failed to coerce interface to int!"
			k.Payload = f
		})
	}

	return int(f_)
}

func mustValueFromMapKey(m interface{}, key string) interface{} {
	return mustMapFromInterface(m)[key]
}

func mustIntFromMapKey(m interface{}, key string) int {
	return mustIntFromFloat64Interface(mustValueFromMapKey(m, key))
}

func mustArrayFromInterface(m interface{}) []interface{} {
	m_, ok := m.([]interface{})

	if !ok {
		log.Fatal(func(k *log.Log) {
			k.Message = "Failed to coerce interface to []interface{}!"
			k.Payload = m
		})
	}

	return m_
}

func mustStringFromInterface(s interface{}) string {
	s_, ok := s.(string)

	if !ok {
		log.Fatal(func(k *log.Log) {
			k.Message = "Failed to coerce interface string!"
			k.Payload = s
		})
	}

	return s_
}

func userActionFromWrap(transactionHash string, wrap sui_types.WrapEvent, token sui_types.SuiToken) user_actions.UserAction {
	var (
		senderAddress  = wrap.UserAddress
		amount_        = wrap.FCoinAmount
		tokenShortName = token.TokenShortName
		tokenDecimals  = token.TokenDecimals
		amount         = misc.NewBigIntFromInt(*amount_)
	)

	return user_actions.NewSwapSui(network.NetworkSui, senderAddress, transactionHash, amount, true, tokenShortName, tokenDecimals)
}

func userActionFromUnwrap(transactionHash string, unwrap sui_types.UnwrapEvent, token sui_types.SuiToken) user_actions.UserAction {
	var (
		senderAddress  = unwrap.UserAddress
		amount_        = unwrap.FCoinAmount
		tokenShortName = token.TokenShortName
		tokenDecimals  = token.TokenDecimals
		amount         = misc.NewBigIntFromInt(*amount_)
	)

	return user_actions.NewSwapSui(network.NetworkSui, senderAddress, transactionHash, amount, false, tokenShortName, tokenDecimals)
}

// DistributeYieldEvent contains a single winner payout
func winnerFromDistributeYieldEvent(transactionHash string, event sui_types.DistributeYieldEvent, token sui_types.SuiToken) winners.Winner {
	currentTime := time.Now()
	tokenDetails := token_details.New(token.TokenShortName, token.TokenDecimals)

	winningAmount := misc.BigIntFromUint64(event.AmountDistributed)

	// TODO will need to use pending winner info to derive many of these
	winner := winners.Winner{
		Network:         network.NetworkSui,
		TransactionHash: transactionHash,
		// TODO
		SendTransactionHash: "",
		WinnerAddress:       event.Recipient,
		WinningAmount:       winningAmount,
		AwardedTime:         currentTime,
		// TODO
		RewardType: "send",
		// TODO
		Application: "none",
		// TODO
		BatchFirstBlock: misc.BigIntFromInt64(0),
		// TODO
		BatchLastBlock: misc.BigIntFromInt64(0),
		// TODO
		RewardTier: 1,

		TokenDetails: tokenDetails,
	}

	return winner
}

// getTransactionBlocks to get all blocks from a list of digests, batching requests if there are more than the RPC's limit
func getTransactionBlocks(client sui.ISuiAPI, digests []string) (models.SuiMultiGetTransactionBlocksResponse, error) {
	const BatchLimit = 50

	var (
		transactionBlocks models.SuiMultiGetTransactionBlocksResponse

		options = models.SuiTransactionBlockOptions{
			ShowInput:         true,
			ShowEvents:        true,
			ShowObjectChanges: true,
		}
	)

	if len(digests) <= BatchLimit {
		return client.SuiMultiGetTransactionBlocks(context.Background(), models.SuiMultiGetTransactionBlocksRequest{
			Digests: digests,
			Options: options,
		})
	}

	for len(digests) > BatchLimit {
		r, err := client.SuiMultiGetTransactionBlocks(context.Background(), models.SuiMultiGetTransactionBlocksRequest{
			Digests: digests[:BatchLimit],
			Options: options,
		})

		if err != nil {
			return transactionBlocks, err
		}

		transactionBlocks = append(transactionBlocks, r...)

		digests = digests[BatchLimit:]
	}

	return transactionBlocks, nil
}
