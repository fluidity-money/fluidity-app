package rpc

import (
	"encoding/json"

	"github.com/fluidity-money/fluidity-app/lib/log"
)

type (
	accountSubscribeResponse struct {
		Jsonrpc string `json:"jsonrpc"`
		Method  string `json:"method"`
		Params  struct {
			Result       AccountNotification `json:"result"`
			Subscription int                 `json:"subscription"`
		} `json:"params"`
	}

	AccountNotification struct {
		Context struct {
			Slot int `json:"slot"`
		} `json:"context"`

		Value struct {
			Data       [2]string `json:"data"`
			Executable bool      `json:"executable"`
			Lamports   int       `json:"lamports"`
			Owner      string    `json:"owner"`
			RentEpoch  int       `json:"rentEpoch"`
		} `json:"value"`
	}
)

// SubscribeAccount subscribes to changes to account and dies with log.Fatal
// if something goes wrong
func (websocket Websocket) SubscribeAccount(programId string, f func(AccountNotification)) {
	_, replies := websocket.subscribe("accountSubscribe", []interface{}{
		programId,
		map[string]string{
			"encoding":   "base64",
			"commitment": "finalized",
		},
	})

	for reply := range replies {
		params := reply.params

		if err := reply.err; err != nil {
			log.Fatal(func(k *log.Log) {
				k.Context = LogContextWebsocket
				k.Message = "Received error off queue for subscribe account!"
				k.Payload = err
			})
		}

		var accountNotification AccountNotification

		err := json.Unmarshal(params, &accountNotification)

		if err != nil {
			log.Fatal(func(k *log.Log) {
				k.Context = LogContextWebsocket

				k.Format(
					"Failed to decode the message (%#v) off the accountSubscribe websocket!",
					string(params),
				)

				k.Payload = err
			})
		}

		f(accountNotification)
	}
}
