// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package main

import (
	"fmt"

	"github.com/fluidity-money/fluidity-app/common/calculation/moving-average"
	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/types/network"
)

func addBtx(key string, transfers int) {
	moving_average.StoreValue(key, transfers)
}

func computeTransactionsSumAndAverage(key string, limit int, shouldPop bool) (int, int) {
	average, sum, err := moving_average.CalculateMovingAverageAndSumMaybePop(
		key,
		limit,
		shouldPop,
	)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Format(
				"Failed to compute the moving average for key %v!",
				key,
			)

			k.Payload = err
		})
	}

	return average, sum
}

func createMovingAverageKey(network_ network.BlockchainNetwork, token string) string {
	return fmt.Sprintf("%v.%v.transfer-count", network_, token)
}
