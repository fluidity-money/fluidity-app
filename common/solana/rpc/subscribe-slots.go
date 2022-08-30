// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package rpc

import (
	"encoding/json"

	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/types/solana"
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

		var slot uint64

		err := json.Unmarshal(result, &slot)

		if err != nil {
			log.Fatal(func(k *log.Log) {
				k.Context = LogContextWebsocket

				k.Format(
					"Failed to decode the message (%#v) off the slotsSubscribe websocket!",
					string(result),
				)

				k.Payload = err
			})
		}

		f(solana.Slot{
			Slot: slot,
		})
	}
}
