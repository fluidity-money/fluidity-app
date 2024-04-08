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
	Tier5Prob = 100
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

// getExpectedTierPcts. Returns the expected percentage chance of being drawn for all tiers
func getExpectedTierPcts() map[int]float64 {
	expectedMap := make(map[int]float64)
	expectedMap[0] = float64((PayoutChances - PayoutTier5)) / float64(PayoutChances) * 100
	expectedMap[1] = float64(Tier1Prob) / float64(PayoutChances) * 100
	expectedMap[2] = float64(Tier2Prob) / float64(PayoutChances) * 100
	expectedMap[3] = float64(Tier3Prob) / float64(PayoutChances) * 100
	expectedMap[4] = float64(Tier4Prob) / float64(PayoutChances) * 100
	expectedMap[5] = float64(Tier5Prob) / float64(PayoutChances) * 100
	return expectedMap
}

// simulate a large number of draws and compare to the expected probabilities.
func simulateDraws() {
	simIterations := 100000
	expectedResults := getExpectedTierPcts()
	simResults := make(map[int]int)
	for i := 0; i < 6; i++ {
		simResults[i] = 0
	}

	for i := 0; i < simIterations; i++ {
		lootboxRewardTier := pickRandomNumber()
		//fmt.Println(lootboxRewardTier)
		simResults[lootboxRewardTier] += 1
	}

	for i := 0; i < 6; i++ {
		fmt.Printf("\nTier %v Got:  %v = %v%%  Expected:%v%%", i, simResults[i], (float64(simResults[i])/float64(simIterations))*100, expectedResults[i])
	}
}
