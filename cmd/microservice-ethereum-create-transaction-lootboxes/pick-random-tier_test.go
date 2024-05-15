package main

import (
	"fmt"
	"testing"

	"github.com/stretchr/testify/assert"
)

// TestPickRandomTier. Simulate a large number of draws and compare to the expected probabilities.
func TestPickRandomTier(t *testing.T) {
	simIterations := 10_000_000

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

	//Calculate the Simulated Result Outcome Percentages for each Tier
	simResultPcts := make(map[int]float64)
	for i := 0; i < 6; i++ {
		simResultPcts[i] = (float64(simResults[i]) / float64(simIterations)) * 100
	}

	//This is "how close" the simulated outcome percentages must be to the expected probabilities to pass the test
	testTolerancePct := float64(0.5) //Percentage, so 0.5 = 0.5%  or  1 = 1%

	//Actual testing & asserts.
	//Compare the Simulated Result Outcome Pcts to an "acceptable" value range around the Expected Result
	for i := 0; i < 6; i++ {

		//Define an acceptable range of [Expected Result Pct] + or - TestTolerancePct
		acceptableHigh := expectedResults[i] + testTolerancePct //expectedResults[i] is a pct. so we just +/- the tolerance
		acceptableLow := expectedResults[i] - testTolerancePct
		if acceptableLow < 0 {
			acceptableLow = 0
		}

		thisSimResultPct := simResultPcts[i] // The simulated outcome pct

		//Assert: Simulated Output Pct must be within the range of acceptable expected values.
		assert.True(t, thisSimResultPct >= float64(acceptableLow) && thisSimResultPct <= float64(acceptableHigh), fmt.Sprintf("Tier %v value is not within expected range", i))
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
