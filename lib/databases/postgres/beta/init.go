package beta

// seed randomness

import (
	"math/rand"
	"time"
)

func init() {
	now := time.Now().UnixNano()

	rand.Seed(now)
}
