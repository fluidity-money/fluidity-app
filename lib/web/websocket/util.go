package websocket

import "math/rand"

func generateSubscriptionId() int {
	return rand.Intn(1000)
}
