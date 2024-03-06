// Copyright 2023 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package main

import (
	"math/big"
	"strconv"

	"github.com/block-vision/sui-go-sdk/sui"
	"github.com/fluidity-money/fluidity-app/lib/databases/timescale/spooler"
	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/queue"
	sui_queue "github.com/fluidity-money/fluidity-app/lib/queues/sui"
	user_actions "github.com/fluidity-money/fluidity-app/lib/queues/user-actions"

	"github.com/fluidity-money/fluidity-app/lib/databases/timescale/winners"
	winnerTypes "github.com/fluidity-money/fluidity-app/lib/queues/winners"
	"github.com/fluidity-money/fluidity-app/lib/types/misc"
	"github.com/fluidity-money/fluidity-app/lib/types/network"
	sui_types "github.com/fluidity-money/fluidity-app/lib/types/sui"
	"github.com/fluidity-money/fluidity-app/lib/util"
)

const (
	EnvSuiHttpUrl             = `FLU_SUI_HTTP_URL`
	RedisLastWinnerCheckpoint = `sui.last-winner-checkpoint`
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

	// lastWinnerCheckpoint is the most recent checkpoint that has had winning transfers tracked by this service and sent to the winners queue
	lastWinnerCheckpoint := getLastWinningCheckpoint(RedisLastWinnerCheckpoint)
	// nothing found, look up in DB
	if lastWinnerCheckpoint.Cmp(big.NewInt(0)) == 0 {
		latestWinners := winners.GetLatestWinners(network.NetworkSui, 1)
		// if there are any winners, find its checkpoint
		if len(latestWinners) != 0 {
			lastWinnerCheckpoint = latestWinners[0].BatchFirstBlock
		}
	}

	log.Debug(func(k *log.Log) {
		k.Format(
			"Using last winner checkpoint %v",
			lastWinnerCheckpoint.String(),
		)
	})

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

		var winners []winners.Winner

		// look up all pending winners up to the checkpoint that has already been tracked as a Winner
		// (every win in the same checkpoint will be rewarded at the same time)
		potentialWinners := spooler.GetPendingSenders(network.NetworkSui, lastWinnerCheckpoint)
		// map containing all new enough pending (sender) winners from old to new, ordered on the fields contained in the event (winner addr, win amount)
		potentialWinnersMap := make(map[string][]spooler.PendingWinner)
		for _, pendingWinner := range potentialWinners {
			key := pendingWinner.SenderAddress + pendingWinner.NativeWinAmount.String()
			potentialWinnersMap[key] = append(potentialWinnersMap[key], pendingWinner)
		}

		var decoratedTransfers []sui_queue.DecoratedTransfer
		for _, transactionBlock := range blocksResponse {
			var (
				objectChanges = transactionBlock.ObjectChanges
				events        = transactionBlock.Events
				transactions  = transactionBlock.Transaction.Data.Transaction.Transactions
				inputs        = transactionBlock.Transaction.Data.Transaction.Inputs
			)

			// process events
			for eventIndex, event := range events {
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
					log.Debug(func(k *log.Log) {
						k.Format(
							"Found a wrap event in block %v at index %v!",
							transactionHash,
							eventIndex,
						)
					})

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
					log.Debug(func(k *log.Log) {
						k.Format(
							"Found an unwrap event in block %v at index %v!",
							transactionHash,
							eventIndex,
						)
					})

					swap := userActionFromUnwrap(transactionHash, unwrapEvent, fluidToken)

					queue.SendMessage(user_actions.TopicUserActionsSui, swap)
				case fluidToken.DistributeYield():
					distributeYieldEvent, err := sui_types.ParseDistributeYield(event.ParsedJson)
					if err != nil {
						log.Fatal(func(k *log.Log) {
							k.Message = "Failed to parse distributeYield event!"
							k.Payload = err
						})
					}

					// on Ethereum, the contract emits start/endblock as part of the reward event signature
					// the Sui contract does not, so we have to work out which txs were actually rewarded by
					// finding pending winners with the same amount and address as emitted, sorted by oldest asumming all actions are sequential

					var (
						senderAddress     = distributeYieldEvent.Recipient
						amountDistributed = distributeYieldEvent.AmountDistributed
					)

					key := senderAddress + strconv.Itoa(int(amountDistributed))
					// a list of pending senders with the same win amount and winner, that aren't already winners
					potentialPendingWinners := potentialWinnersMap[key]
					if len(potentialPendingWinners) == 0 {
						log.Fatal(func(k *log.Log) {
							k.Format(
								"No pending winners found after checkpoint %v for winner %v and amount %v!",
								transactionBlock.Checkpoint,
								senderAddress,
								amountDistributed,
							)
						})
					}

					// take the oldest winner and remove it
					sender := potentialPendingWinners[0]
					potentialPendingWinners = potentialPendingWinners[1:]

					log.Debug(func(k *log.Log) {
						k.Format(
							"Found a win event in block %v at index %v for transaction %v index %v!",
							transactionHash,
							eventIndex,
							sender.TransactionHash,
							sender.LogIndex.String(),
						)
					})

					// find the recipient
					recipient := spooler.GetPendingRecipientBySend(sender.Network, sender.TransactionHash, *sender.LogIndex)

					// create events to be written to the queue
					senderWin := winnerFromDistributeYieldEvent(transactionHash, distributeYieldEvent, sender, fluidToken)
					recipientWin := winnerFromDistributeYieldEvent(transactionHash, distributeYieldEvent, recipient, fluidToken)

					winners = append(winners, senderWin, recipientWin)
				}
			}

			// process transactions in PTB
			// wrap/unwrap/yield will not be double processed as their internal calls aren't emitted like a regular transaction
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
					// Result(i) == NestedResult(i, 0)
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
							transactionBlock.Digest,
							txIndex,
						)
					})
					continue
				}

				amountBig, _ := new(big.Int).SetString(amountTransferred, 10)
				amountInt := misc.NewBigIntFromInt(*amountBig)
				txIndexInt := misc.BigIntFromInt64(int64(txIndex))

				send := user_actions.NewSendSui(network.NetworkSui, senderAddress, recipientAddress, transactionBlock.Digest, amountInt, txIndexInt, fluidToken.TokenShortName, fluidToken.TokenDecimals)

				decoratedTransfer := sui_queue.DecoratedTransfer{
					UserAction: send,
					Data:       transactionBlock.Transaction.Data,
				}

				decoratedTransfers = append(decoratedTransfers, decoratedTransfer)
			}

		}

		// now send to the respective queues
		// user actions are processed by the application server to add application info
		queue.SendMessage(sui_queue.TopicDecoratedTransfers, decoratedTransfers)

		// winners are directly processed into timescale
		for _, winner := range winners {
			queue.SendMessage(winnerTypes.TopicWinnersSui, winner)
			// keep track of the last winning checkpoint
			writeLastWinningCheckpoint(RedisLastWinnerCheckpoint, checkpoint.SequenceNumber)
		}
	})
}
