package oneinch

import (
	"math/big"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestCalculateStaticFee(t *testing.T) {
	amount := big.NewRat(123, 1)
	staticFeeRate := big.NewRat(1, 3)

	staticFee := calculateStaticFee(amount, staticFeeRate)

	assert.Equal(t, big.NewRat(123, 3), staticFee)
}

type calculateSlippageFeeTest struct {
	amount,
	slippageFeeRate,
	poolBalance,
	expected *big.Rat
}

func TestCalcualateSlippageFee(t *testing.T) {
	tests := []calculateSlippageFeeTest{
		{big.NewRat(123, 1), big.NewRat(1, 3), big.NewRat(123456789, 1), big.NewRat(123*123, 123456789*3)},
		{big.NewRat(0, 1), big.NewRat(1, 3), big.NewRat(123456789, 1), big.NewRat(0, 1)},
	}

	for _, test := range tests {
		var (
			amount          = test.amount
			slippageFeeRate = test.slippageFeeRate
			poolBalance     = test.poolBalance
			expected        = test.expected
		)

		slippageFee := calculateSlippageFee(amount, slippageFeeRate, poolBalance)

		assert.Equal(t, expected, slippageFee)
	}
}

type calculateTotalFluidFeeTest struct {
	amount,
	staticFeeNum,
	slippageFeeNum,
	srcBalance,
	dstBalance *big.Rat
	amountIsFluid bool
	feeDecimals   int
	expected      *big.Rat
}

func TestCalculateTotalFluidFee(t *testing.T) {
	tests := []calculateTotalFluidFeeTest{
		{big.NewRat(12, 1), big.NewRat(3, 1), big.NewRat(5, 1), big.NewRat(123, 1), big.NewRat(1234, 1), false, 3, big.NewRat(85_964_956_915_137, 510_962_500_000)},
		{big.NewRat(12, 1), big.NewRat(3, 1), big.NewRat(5, 1), big.NewRat(123, 1), big.NewRat(1234, 1), true, 3, big.NewRat(381_279_627, 49_850_000)},
	}

	for _, test := range tests {
		var (
			amount         = test.amount
			staticFeeNum   = test.staticFeeNum
			slippageFeeNum = test.slippageFeeNum
			srcBalance     = test.srcBalance
			dstBalance     = test.dstBalance
			amountIsFluid  = test.amountIsFluid
			feeDecimals    = test.feeDecimals
			expected       = test.expected
		)

		totalFluidFee := calculateTotalFluidFee(amount, staticFeeNum, slippageFeeNum, srcBalance, dstBalance, amountIsFluid, feeDecimals)

		assert.Equal(t, expected, totalFluidFee)
	}

}
