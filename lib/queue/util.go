package queue

import (
	"fmt"

	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/util"
)

// RandomConsumerPrefixLength to append to the worker id
const RandomConsumerPrefixLength = 8

// generateRandomConsumerId by taking a workerId name and appending
// .<random number> to it
func generateRandomConsumerId(workerId string) string {
	randomString := util.RandomString(RandomConsumerPrefixLength)

	consumerId := fmt.Sprintf(
		"%s.%s",
		workerId,
		randomString,
	)

	return consumerId
}

func debug(message string, arguments ...interface{}) {
	log.Debug(func(k *log.Log) {
		k.Context = Context
		k.Format(message, arguments...)
	})
}
