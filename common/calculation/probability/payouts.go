// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package probability

import (
	"math/big"

	"github.com/fluidity-money/fluidity-app/lib/types/applications"
	"github.com/fluidity-money/fluidity-app/lib/types/misc"
	"github.com/fluidity-money/fluidity-app/lib/types/worker"
)

func CalculatePayoutsCombined(sourcePayouts map[applications.UtilityName][]worker.Payout, winningBalls int) map[applications.UtilityName]worker.Payout {
	payouts := make(map[applications.UtilityName]worker.Payout)

	for utility, payout := range sourcePayouts {
		var (
			totalPayout = payout[winningBalls-1]

			payoutNative = totalPayout.Native
			payoutUsd    = totalPayout.Usd
		)

		payouts[utility] = worker.Payout{
			Native: payoutNative,
			Usd:    payoutUsd,
		}
	}

	return payouts
}

// returns the amount won by the sender and receiver with given balls and payouts
func CalculatePayoutsSplit(sourcePayouts map[applications.UtilityName][]worker.Payout, winningBalls int) (map[applications.UtilityName]worker.Payout, map[applications.UtilityName]worker.Payout) {
	var (
		fromAmounts = make(map[applications.UtilityName]worker.Payout)
		toAmounts   = make(map[applications.UtilityName]worker.Payout)
	)

	for utility, payout := range sourcePayouts {
		var (
			totalPayout = payout[winningBalls-1]

			payoutNative = &totalPayout.Native.Int
			payoutUsd    = totalPayout.Usd

			fiveInt = big.NewInt(5)

			fromAmountNative misc.BigInt
			toAmountNative   misc.BigInt

			fromAmountUsd float64
			toAmountUsd   float64
		)
		// 20%
		toAmountNative.Div(payoutNative, fiveInt)
		toAmountUsd = payoutUsd / 5

		// 80%
		fromAmountNative.Sub(payoutNative, &toAmountNative.Int)
		fromAmountUsd = payoutUsd - fromAmountUsd

		toAmounts[utility] = worker.Payout{
			Native: toAmountNative,
			Usd:    toAmountUsd,
		}

		fromAmounts[utility] = worker.Payout{
			Native: fromAmountNative,
			Usd:    fromAmountUsd,
		}
	}

	return fromAmounts, toAmounts
}
