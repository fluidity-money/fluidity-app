// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package main

import (
	"fmt"
	"math/rand"
)

// PayoutChances to pick the random number between 0 and this value
const PayoutChances = 1_000_000_000

const (

	// The probabilities of a Tier being drawn (out of PayoutChances draws)
	Tier1Prob = 400_000_000 // this is 400_000_000 / 1_000_000_000
	Tier2Prob = 100_000_000 // this is 100_000_000 / 1_000_000_000
	Tier3Prob = 50_000_000  //etc...
	Tier4Prob = 10_000_000
	Tier5Prob = 1000
	//The probability of NoBottle is: (PayoutChances - (The Sum of all TierXProb values above)) / PayoutChances

	// Thresholds that the random number must fall below to win a tier
	PayoutTier1 = Tier1Prob
	PayoutTier2 = Tier2Prob + PayoutTier1
	PayoutTier3 = Tier3Prob + PayoutTier2
	PayoutTier4 = Tier4Prob + PayoutTier3
	PayoutTier5 = Tier5Prob + PayoutTier4
	//Anything above PayoutTier5 is NoBottle

)

// pickRandomReward. Returns Lootbox Tier 0-5, 0 being no rewards.
func pickRandomNumber() int {
	n := rand.Int31n(PayoutChances)
	switch {
	case n <= PayoutTier1:
		return 1
	case n <= PayoutTier2:
		return 2
	case n <= PayoutTier3:
		return 3
	case n <= PayoutTier4:
		return 4
	case n <= PayoutTier5:
		return 5
	case n > PayoutTier5 && n <= PayoutChances:
		return 0 //NoBottle
	default:
		panic(fmt.Sprintf("bad pickRandomNumber impl: %v", n))
	}
}
