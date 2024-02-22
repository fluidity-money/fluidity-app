// Copyright 2023 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package main

import (
	"context"
	"fmt"

	"github.com/block-vision/sui-go-sdk/models"
	"github.com/block-vision/sui-go-sdk/sui"
	"github.com/fluidity-money/fluidity-app/lib/log"
	queue "github.com/fluidity-money/fluidity-app/lib/queues/sui"
	sui_types "github.com/fluidity-money/fluidity-app/lib/types/sui"
	"github.com/fluidity-money/fluidity-app/lib/util"
)

const (
	EnvSuiHttpUrl = `FLU_SUI_HTTP_URL`
)

func main() {
	var (
		suiHttpUrl = util.GetEnvOrFatal(EnvSuiHttpUrl)
	)

	var (
		httpClient = sui.NewSuiClient(suiHttpUrl)
        // TODO source fluid token from env, including decimals
		fluidToken = sui_types.SuiToken{
			PackageId: "0xeeb05606f5e8033e807c9c86e6f60bf4225f6110d511e45d99d74a562b0a24fe",
		}
	)

	queue.Checkpoints(func(checkpoint queue.Checkpoint) {
		// look up all digests
		blocksResponse, err := httpClient.SuiMultiGetTransactionBlocks(context.Background(), models.SuiMultiGetTransactionBlocksRequest{
			Digests: checkpoint.Transactions,
			Options: models.SuiTransactionBlockOptions{
				ShowInput:         true,
				ShowEvents:        true,
				ShowObjectChanges: true,
			},
		})

		if err != nil {
			log.Fatal(func(k *log.Log) {
				k.Format(
					"Failed to fetch transaction blocks for checkpoint %v",
					checkpoint.SequenceNumber,
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
            // TODO do something with events
			for _, event := range events {
				switch event.Type {
				case fluidToken.Wrap():
					wrapEvent, err := sui_types.ParseWrap(event.ParsedJson)
					if err != nil {
						log.Fatal(func(k *log.Log) {
							k.Message = "Failed to parse wrap event!"
							k.Payload = err
						})
					}
					fmt.Println(wrapEvent)
				case fluidToken.Unwrap():
					unwrapEvent, err := sui_types.ParseUnwrap(event.ParsedJson)
					if err != nil {
						log.Fatal(func(k *log.Log) {
							k.Message = "Failed to parse unwrap event!"
							k.Payload = err
						})
					}
					fmt.Println(unwrapEvent)
				case fluidToken.DistributeYield():
					distributeYieldEvent, err := sui_types.ParseDistributeYield(event.ParsedJson)
					if err != nil {
						log.Fatal(func(k *log.Log) {
							k.Message = "Failed to parse distributeYield event!"
							k.Payload = err
						})
					}
					fmt.Println(distributeYieldEvent)
				}
			}

			// TODO make a parser for these map/tuples that use the same layouts
            // such as map[string]interface{}, []interface{}

            // TODO make this entire thing less brittle, moved into functions

			// process transactions in PTB
			// wrap/unwrap/yield will not be double processed as their internal calls aren't emitted like a regular transaction
			for _, transaction := range transactions {
				// only interested in TransferObjects
				if transaction.TransferObjects == nil {
					continue
				}

				// has tuple type [[]{Result int}, {Input int}]
				t := transaction.TransferObjects

				// find the recipient address in the inputs array
				recipientIndex := int(t[1].(map[string]interface{})["Input"].(float64))
				recipientAddress := inputs[recipientIndex]["value"].(string)

				// parse either a Result or NestedResult from TransferObjects
				result_ := t[0].([]interface{})[0].(map[string]interface{})

				var i, j int

				if r := result_["NestedResult"]; r != nil {
					i = int(r.([]interface{})[0].(float64))
					j = int(r.([]interface{})[1].(float64))
				}

				if r := result_["Result"]; r != nil {
					// Result(i) = NestedResult(i, 0)
					i = int(r.(float64))
					j = 0
				}

				// find the SplitCoins transaction referenced by TransferObjects
				txAtI := transactions[i]

				// if SplitCoins is nil, we don't know how to parse the transfer, so skip
				if txAtI.SplitCoins == nil {
					log.Debug(func(k *log.Log) {
						k.Format(
							"Transaction at %v was not SplitCoins - skipping!",
							i,
						)
					})
					continue
				}

				// if the first value is GasCoin, this transfer is using the Sui token
				if f, ok := txAtI.SplitCoins[0].(string); ok && f == "GasCoin" {
					log.Debug(func(k *log.Log) {
						k.Message = "First SplitCoins entry was GasCoin - skipping!"
					})
					continue
				}

				// parse the SplitCoins tuple
				// find the index of the coin that was split in the inputs array
				first := txAtI.SplitCoins[0].(map[string]interface{})
				coinArgIndex := int(first["Input"].(float64))

				// find the index of the amount transferred in the inputs array
				second := txAtI.SplitCoins[1].([]interface{})[j]
				amountTransferredIndex := int(second.(map[string]interface{})["Input"].(float64))

				// find the amount transferred in the inputs array
				// must be u64
				amountTransferred := inputs[amountTransferredIndex]["value"].(string)

				// find the ID of the coin that's being split in the inputs array
				splitCoinId := inputs[coinArgIndex]["objectId"].(string)

				var senderAddress string
				// find splitCoinId in objectChanges
				for _, objectChange := range objectChanges {
					if objectChange.ObjectId != splitCoinId {
						continue
					}

					// found the correct object, sanity check that it's right
					if objectChange.Type == "mutated" && objectChange.ObjectType == fluidToken.ObjectType() {
						senderAddress = objectChange.Owner.AddressOwner
						break
					}
				}

				// correct object didn't exist
				if senderAddress == "" {
					log.Fatal(func(k *log.Log) {
						k.Message = "sender address not set - object change not found!"
					})
				}

                // TODO - do something with tx
				fmt.Println("tx had sender", senderAddress, "recipient", recipientAddress, "amountTransferred", amountTransferred)
			}

		}
	})
}
