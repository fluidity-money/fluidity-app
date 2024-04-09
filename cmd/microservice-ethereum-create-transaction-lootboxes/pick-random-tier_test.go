package main

import (
	"fmt"
	"testing"

	"github.com/stretchr/testify/assert"
)

// TestPickRandomTier. Simulate a large number of draws and compare to the expected probabilities.
func TestPickRandomTier(t *testing.T) {
	simIterations := 10_000_000

	//This is "how close" the simulated probabilities must be to the expected probs to pass the test
	testTolerancePct := float64(0.5) //Percentage, so 0.5 = 0.5%  or  1 = 1%

	expectedResults := getExpectedTierPcts()

	//Prepare result data structure
	simResults := make(map[int]int)
	for i := 0; i < 6; i++ {
		simResults[i] = 0
	}

	//Run Simulations
	for i := 0; i < simIterations; i++ {
		lootboxRewardTier := pickRandomNumber()
		simResults[lootboxRewardTier] += 1
	}

	//Informational: Output Actual vs Expected probabilities
	simResultPcts := make(map[int]float64)
	fmt.Printf("\nIterations:  %v", simIterations)
	for i := 0; i < 6; i++ {
		simResultPcts[i] = (float64(simResults[i]) / float64(simIterations)) * 100
		fmt.Printf("\nTier %v Got:  %v = %f%%  Expected:%f%%", i, simResults[i], simResultPcts[i], expectedResults[i])
	}

	fmt.Printf("\n")

	//Actual testing & asserts
	for i := 0; i < 6; i++ {
		acceptableHigh := expectedResults[i] + testTolerancePct //expectedResults[i] is a pct. so we just +/- the tolerance
		acceptableLow := expectedResults[i] - testTolerancePct
		if acceptableLow < 0 {
			acceptableLow = 0
		}

		thisResult := simResultPcts[i]
		fmt.Printf("\nTier %v Acceptable Range %v - %f   Actual:%f", i, acceptableLow, acceptableHigh, thisResult)
		assert.True(t, thisResult >= float64(acceptableLow) && thisResult <= float64(acceptableHigh), fmt.Sprintf("Tier %v value is not within expected range", i))
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
