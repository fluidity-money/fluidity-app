// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package queue

import (
	"fmt"

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
