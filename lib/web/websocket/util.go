package websocket

import (
	"math/rand"

	"github.com/fluidity-money/fluidity-app/lib/log"
)

func debug(message string, content ...interface{}) {
	log.Debug(func(k *log.Log) {
		k.Context = Context
		k.Format(message, content...)
	})
}

func generateSubscriptionId() int {
	return rand.Intn(1000)
}
