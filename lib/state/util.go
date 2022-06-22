package state

import (
	"encoding/json"
	"github.com/fluidity-money/fluidity-app/lib/log"
)

func serialiseToBytes(content interface{}) []byte {
	bytes, err := json.Marshal(content)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Context = Context
			k.Message = "Failed to serialise some content to JSON!"
			k.Payload = err
		})
	}

	return bytes
}
