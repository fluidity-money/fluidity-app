// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package rpc

import (
	"encoding/json"

	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/types/solana"
	solCommon "github.com/fluidity-money/fluidity-app/common/solana"
)

// SubscribeSlots subscribes to new slots
func (websocket Websocket) SubscribeSlots(f func(solana.Slot)) {
	replies := websocket.subscribe("slotSubscribe", nil)

	for reply := range replies {
		result := reply.result

		if err := reply.err; err != nil {
			log.Fatal(func(k *log.Log) {
				k.Context = LogContextWebsocket
				k.Message = "Received error off queue for slotsSubscribe!"
				k.Payload = err
			})
		}

		var slot solana.Slot

		isEmptyMessage := len(result) == 0

		if isEmptyMessage {
			continue
		}

		// assume that the message was empty for keepalive!

		err := json.Unmarshal(result, &slot)

		if err != nil {
			log.Fatal(func(k *log.Log) {
				k.Context = LogContextWebsocket

				k.Format(
					"Failed to decode the message %#v off the slotsSubscribe websocket!",
					string(result),
				)

				k.Payload = err
			})
		}

		f(slot)
	}
}

// SubscribeBlocks to subscribe to new blocks with the given filter, if provided
func (websocket Websocket) SubscribeBlocks(accountOrProgram solCommon.PublicKey, f func(BlockResponse)) {
	var firstParam interface{}

	if accountOrProgram.IsZero() {
		firstParam = "all"
	} else {
		firstParam = struct {
			MentionsAccountOrProgram string `json:"mentionsAccountOrProgram"`
		} {
			accountOrProgram.String(),
		}
	}

	params := []interface{}{
		firstParam,
		struct {
			Encoding					   string `json:"encoding"`
			TransactionDetails			   string `json:"transactionDetails"`
			MaxSupportedTransactionVersion int    `json:"maxSupportedTransactionVersion"`
		}{
			MaxSupportedTransactionVersion: 0,
			Encoding: "jsonParsed", 
			TransactionDetails: "none",
		}, 
	} 

	replies := websocket.subscribe("blockSubscribe", params)

	for reply := range replies {
		result := reply.result

		if err := reply.err; err != nil {
			log.Fatal(func(k *log.Log) {
				k.Context = LogContextWebsocket
				k.Message = "Received error off queue for blocksSubscribe!"
				k.Payload = err
			})
		}

		var block BlockResponse

		isEmptyMessage := len(result) == 0

		if isEmptyMessage {
			continue
		}

		// assume that the message was empty for keepalive!
		err := json.Unmarshal(result, &block)

		if err != nil {
			log.Fatal(func(k *log.Log) {
				k.Context = LogContextWebsocket

				k.Format(
					"Failed to decode the message %#v off the blocksSubscribe websocket!",
					string(result),
				)

				k.Payload = err
			})
		}

		f(block)
	}
}

type BlockResponse struct {
	Value struct {
		Slot  uint64		   `json:"slot"`
		Error *solana.RpcError `json:"err"`
		Block solana.Block     `json:"block"`
	} `json:"value"`
}
