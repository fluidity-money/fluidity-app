// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package main

import (
	"math/big"

	"github.com/fluidity-money/fluidity-app/lib/types/misc"
)

// returns the amount won by the sender and receiver with given balls and payouts
func calculatePayouts(sourcePayouts []*misc.BigInt, winningBalls int) (*misc.BigInt, *misc.BigInt) {
	var (
		totalPayout = sourcePayouts[winningBalls-1]
		payoutInt   = &totalPayout.Int
		fiveInt     = big.NewInt(5)

		fromAmount misc.BigInt
		toAmount   misc.BigInt
	)
	// 20%
	toAmount.Div(payoutInt, fiveInt)

	fromAmount.Sub(payoutInt, &toAmount.Int)

	return &fromAmount, &toAmount
}
