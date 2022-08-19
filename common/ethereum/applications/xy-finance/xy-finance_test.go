package xy_finance

import (
	"math/big"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestGetXyFinanceSwapFees(t *testing.T) {
	const (
		// transfer blob containing a 6665.807925112976222113e+18 DAI -> 6664.296758e+6 USDT value swap
		transferDataBlobB64 = `"AAAAAAAAAAAAAAAAaxdUdOiQlMRNqYuVTu3qxJUnHQ8AAAAAAAAAAAAAAADawX+VjS7lI6IgYgaZRZfBPYMexwAAAAAAAAAAAAAAAAAAAAAAAAAAAAABaVqq/u0elKehAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAY05GTYAAAAAAAAAAAAAAAAi+dz0ZHCE1sMbJ2X2kQzYXBeMGAAAAAAAAAAAAAAAACL53PRkcITWwxsnZfaRDNhcF4wY"`
		// response that can be parsed as a 0.02% fee
		symbolRpcResponse = "0x0000000000000000000000000000000000000000000000000000b5e620f480000000000000000000000000000000000000000000000000000000000000000000"
	)

	var (
		rpcMethods  = make(map[string]interface{})
		callMethods = make(map[string]interface{})
	)

	rpcMethods["eth_getCode"] = "0x0"
	callMethods["symbol"] = symbolRpcResponse

}

type calculateXyFinanceSwapFeeTest struct {
	amount,
	usdToTokenRatio *big.Rat
	targetChainId uint8
	expected      *big.Rat
}

func TestCalculateXyFinanceSwapFee(t *testing.T) {
	tests := []calculateXyFinanceSwapFeeTest{
		// It calculates Ethereum stable token Fee
		{big.NewRat(1000000, 1), big.NewRat(1, 1), 1, big.NewRat(350, 1)},

		// It calculates Minimum Ethereum stable token Fee
		{big.NewRat(100000, 1), big.NewRat(1, 1), 1, big.NewRat(40, 1)},

		// It calculates Maximum Ethereum stable token Fee
		{big.NewRat(10000000, 1), big.NewRat(1, 1), 1, big.NewRat(2000, 1)},

		// It calculates 100 Tok - 1 USD Ethereum token fee
		{big.NewRat(100000000, 1), big.NewRat(100, 1), 1, big.NewRat(350, 1)},
	}

	for _, test := range tests {
		var (
			amount          = test.amount
			usdToTokenRatio = test.usdToTokenRatio
			targetChainId   = test.targetChainId
			expected        = test.expected
		)

		xyFluidFee := calculateXyFinanceSwapFee(amount, usdToTokenRatio, targetChainId)

		assert.Equal(t, expected, xyFluidFee)
	}

}
