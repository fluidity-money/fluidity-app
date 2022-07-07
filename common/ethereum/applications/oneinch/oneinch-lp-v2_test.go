package oneinch

import (
	"math"
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
}

func TestCalculateTotalFluidFee(t *testing.T) {
	tests := []calculateTotalFluidFeeTest{
		{big.NewRat(123, 1), big.NewRat(1, 1), big.NewRat(2, 1), big.NewRat(12345678, 1), big.NewRat(123456789, 1), false},
		{big.NewRat(123, 1), big.NewRat(1, 1), big.NewRat(2, 1), big.NewRat(12345678, 1), big.NewRat(123456789, 1), true},
	}

	for _, test := range tests {
		var (
			amount         = test.amount
			staticFeeNum   = test.staticFeeNum
			slippageFeeNum = test.slippageFeeNum
			srcBalance     = test.srcBalance
			dstBalance     = test.dstBalance
			amountIsFluid  = test.amountIsFluid
		)

		totalFluidFee := calculateTotalFluidFee(amount, staticFeeNum, slippageFeeNum, srcBalance, dstBalance, amountIsFluid)

		feeDecimalsRat := new(big.Rat).SetFloat64(math.Pow10(FeeDecimals))
		staticFeeRate := new(big.Rat).Quo(staticFeeNum, feeDecimalsRat)
		staticFee := calculateStaticFee(amount, staticFeeRate)

		var (
			slippageFeeNum_   *big.Rat
			slippageFeeDenom_ *big.Rat
		)

		slippageFeeNum_.Add(amount, srcBalance)
		slippageFeeNum_.Sub(slippageFeeNum, staticFee)
		slippageFeeNum_.Mul(slippageFeeNum, slippageFeeNum)
		slippageFeeNum_.Mul(slippageFeeNum, dstBalance)

		slippageFeeDenom_.Sub(amount, staticFee)
		slippageFeeDenom_.Mul(feeDecimalsRat, slippageFeeDenom_)

		slippageFee := new(big.Rat).Quo(slippageFeeNum_, slippageFeeDenom_)

		expected := new(big.Rat).Add(staticFee, slippageFee)

		if !amountIsFluid {
			newSrcBalance := new(big.Rat).Add(amount, srcBalance)
			srcToDstRate := new(big.Rat).Quo(dstBalance, newSrcBalance)
			expected = expected.Mul(expected, srcToDstRate)
		}

		assert.Equal(t, expected, totalFluidFee)
	}

}
