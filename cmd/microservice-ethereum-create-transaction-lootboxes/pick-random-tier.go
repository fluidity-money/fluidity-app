// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package main

import (
	"fmt"
	"math/rand"
)

// PayoutChances to pick the random number between
const PayoutChances = 1_000_000_000

const (
	// PayoutTier1 that the random number must fall below to win
	PayoutTier1 = 400_000_000

	// PayoutTier2 that the payout must be below, but above PayoutTier1, to win
	PayoutTier2 = 500_000_000

	// PayoutTier3
	PayoutTier3 = 550_000_000

	// PayoutTier4
	PayoutTier4 = 560_000_000

	// PayoutNoBottle is awarded when no bottle is sent to the user
	PayoutNoBottle = 999_999_000

	// PayoutTier5 (very low probability)
	PayoutTier5 = 1_000_000_000
)

// pickRandomReward, 0 being no rewards.
func pickRandomNumber() int {
	n := rand.Int31n(PayoutChances)
	switch {
	case n >= PayoutNoBottle && n <= PayoutTier5:
		return 5
	case n >= PayoutTier4 && n <= PayoutNoBottle:
		return 0
	case n >= PayoutTier3 && n <= PayoutTier4:
		return 4
	case n >= PayoutTier2 && n <= PayoutTier3:
		return 3
	case n >= PayoutTier1 &&n  <= PayoutTier2:
		return 2
	case n <= PayoutTier1:
		return 1
	default:
		panic(fmt.Sprintf("bad pickRandomNumber impl: %v", n))
	}
}
