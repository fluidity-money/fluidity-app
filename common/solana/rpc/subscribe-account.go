package rpc

import (
	"encoding/json"

	"github.com/fluidity-money/fluidity-app/common/solana"
	"github.com/fluidity-money/fluidity-app/lib/log"
	types "github.com/fluidity-money/fluidity-app/lib/types/solana"
)

type accountNotification struct {
	Value types.Account `json:"value"`
}

// SubscribeAccount subscribes to changes to account and dies with log.Fatal
// if something goes wrong
func (websocket Websocket) SubscribeAccount(publicKey solana.PublicKey, f func(types.Account)) {
	programId := publicKey.ToBase58()

	replies := websocket.subscribe("accountSubscribe", []interface{}{
		programId,
		map[string]string{
			"encoding":   "base64",
			"commitment": "finalized",
		},
	})

	for reply := range replies {
		result := reply.result

		if err := reply.err; err != nil {
			log.Fatal(func(k *log.Log) {
				k.Context = LogContextWebsocket
				k.Message = "Received error off queue for accountSubscribe!"
				k.Payload = err
			})
		}

		var accountNotification accountNotification

		err := json.Unmarshal(result, &accountNotification)

		if err != nil {
			log.Fatal(func(k *log.Log) {
				k.Context = LogContextWebsocket

				k.Format(
					"Failed to decode the message %#v off the accountSubscribe websocket!",
					string(result),
				)

				k.Payload = err
			})
		}

		f(accountNotification.Value)
	}
}
