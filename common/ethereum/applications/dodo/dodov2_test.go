package dodo

import (
	"math/big"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestGetDodoV2Fees(t *testing.T) {
	const (
		// transfer blob containing a 6665.807925112976222113e+18 DAI -> 6664.296758e+6 USDT value swap
		transferDataBlobB64 = `"AAAAAAAAAAAAAAAAaxdUdOiQlMRNqYuVTu3qxJUnHQ8AAAAAAAAAAAAAAADawX+VjS7lI6IgYgaZRZfBPYMexwAAAAAAAAAAAAAAAAAAAAAAAAAAAAABaVqq/u0elKehAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAY05GTYAAAAAAAAAAAAAAAAi+dz0ZHCE1sMbJ2X2kQzYXBeMGAAAAAAAAAAAAAAAACL53PRkcITWwxsnZfaRDNhcF4wY"`
		// response that can be parsed as a 0.02% fee
		lpFeeRateRpcResponse = "0x0000000000000000000000000000000000000000000000000000b5e620f480000000000000000000000000000000000000000000000000000000000000000000"
	)

	var (
		rpcMethods  = make(map[string]interface{})
		callMethods = make(map[string]interface{})
	)

	rpcMethods["eth_getCode"] = "0x0"
	callMethods["_LP_FEE_RATE_"] = lpFeeRateRpcResponse

}

type calculateDodoV2FeeTest struct {
	fromAmount,
	toAmount,
	lpFeeRate,
	mtToTokenFee *big.Rat
	toTokenIsFluid bool
	expected       *big.Rat
}

func TestCalculateTotalFluidFee(t *testing.T) {
	tests := []calculateDodoV2FeeTest{
		// It calculates mtToTokenFee in toToken
		{big.NewRat(100, 1), big.NewRat(1, 1), big.NewRat(0, 1), big.NewRat(9, 1), true, big.NewRat(9, 1)},

		// It calculates lpToTokenFee in toToken
		{big.NewRat(100, 1), big.NewRat(1, 1), big.NewRat(9, 10), big.NewRat(0, 1), true, big.NewRat(9, 1)},

		// It calculates totalToTokenFee in toToken
		{big.NewRat(100, 1), big.NewRat(6, 1), big.NewRat(1, 10), big.NewRat(3, 1), true, big.NewRat(4, 1)},

		// It calculates totalToTokenFee in fromToken
		{big.NewRat(100, 1), big.NewRat(6, 1), big.NewRat(1, 10), big.NewRat(3, 1), false, big.NewRat(40, 1)},
	}

	for _, test := range tests {
		var (
			fromAmount     = test.fromAmount
			toAmount       = test.toAmount
			lpFeeRate      = test.lpFeeRate
			mtToTokenFee   = test.mtToTokenFee
			toTokenIsFluid = test.toTokenIsFluid
			expected       = test.expected
		)

		dodoFluidFee := calculateDodoV2Fee(fromAmount, toAmount, lpFeeRate, mtToTokenFee, toTokenIsFluid)

		assert.Equal(t, expected, dodoFluidFee)
	}

}
