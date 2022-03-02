package websocket

import (
	"math/rand"
	"time"

	"github.com/fluidity-money/fluidity-app/lib/log"
)

func init() {
	if !log.DebugEnabled() {
		return
	}

	rand.Seed(time.Now().Unix())
}
