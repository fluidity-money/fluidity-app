package rpc

import (
	"encoding/json"

	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/types/solana"
)

type slotResponse struct {
	Result solana.Slot `json:"result"`
}

// SubscribeAccount subscribes to changes to account and dies with log.Fatal
// if something goes wrong
func (websocket Websocket) SubscribeSlots(f func(solana.Slot)) {
	_, replies := websocket.subscribe("slotsSubscribe", map[string]interface{}{})

	for reply := range replies {
		params := reply.params

		if err := reply.err; err != nil {
			log.Fatal(func(k *log.Log) {
				k.Context = LogContextWebsocket
				k.Message = "Received error off queue for slotsSubscribe!"
				k.Payload = err
			})
		}

		var slot slotResponse

		err := json.Unmarshal(params, &slot)

		if err != nil {
			log.Fatal(func(k *log.Log) {
				k.Context = LogContextWebsocket

				k.Format(
					"Failed to decode the message (%#v) off the slotsSubscribe websocket!",
					string(params),
				)

				k.Payload = err
			})
		}

		f(slot.Result)
	}
}
