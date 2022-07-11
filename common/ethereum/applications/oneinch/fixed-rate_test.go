package oneinch

import (
	"math/big"
	"testing"

	"github.com/stretchr/testify/assert"
)

type calculateFixedRateFeeTest struct {
	token0Amount,
	token1Amount,
	expected *big.Rat
}

func TestCalculateFixedRateFee(t *testing.T) {
	tests := []calculateFixedRateFeeTest{
		{big.NewRat(-123, 1), big.NewRat(100, 3), big.NewRat(369-100, 3)},
		{big.NewRat(123, 1), big.NewRat(-100, 3), big.NewRat(369-100, 3)},
	}

	for _, test := range tests {
		var (
			token0Amount = test.token0Amount
			token1Amount = test.token1Amount
			expected     = test.expected
		)

		totalFluidFee := calculateFixedRateFee(token0Amount, token1Amount)

		assert.Equal(t, expected, totalFluidFee)
	}
}
