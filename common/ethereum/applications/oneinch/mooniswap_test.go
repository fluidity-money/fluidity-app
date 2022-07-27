package oneinch

import (
	"math/big"
	"testing"

	"github.com/stretchr/testify/assert"
)

type calculateMooniswapFeeTest struct {
	amount,
	result *big.Rat
	amountIsFluid bool
	expected      *big.Rat
}

func testCalculateMooniswapFee(t *testing.T) {
	tests := []calculateMooniswapFeeTest{
		{big.NewRat(100, 1), big.NewRat(997, 10), true, big.NewRat(3, 10)},
		{big.NewRat(100, 1), big.NewRat(997, 10), false, big.NewRat(3, 10)},
	}

	for _, test := range tests {
		var (
			amount        = test.amount
			result        = test.result
			amountIsFluid = test.amountIsFluid
			expected      = test.expected
		)

		fee := calculateMooniswapFee(amount, result, amountIsFluid)

		assert.Equal(t, expected, fee)
	}
}
