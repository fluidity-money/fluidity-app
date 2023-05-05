package main

import (
	"math/big"
	"testing"

	"github.com/fluidity-money/fluidity-app/lib/types/ethereum"
	"github.com/fluidity-money/fluidity-app/lib/types/worker"
	"github.com/fluidity-money/fluidity-app/lib/types/misc"

	"github.com/stretchr/testify/assert"
)

func TestCalculateLegacyFeeTransactionFee(t *testing.T) {
	var (
		testGasLimit, _ = misc.BigIntFromString("6962458")
		testGasPrice, _ = misc.BigIntFromString("132635586583")
	)

	transaction := ethereum.Transaction{
		GasLimit: *testGasLimit,
		GasPrice: *testGasPrice,
	}

	emission := new(worker.Emission)

	// price of today

	ethPriceUsd := new(big.Rat).SetFloat64(1896.07)

	ethereumDecimalsRat := new(big.Rat).SetInt64(1e18)

	expectedFee, _ := new(big.Rat).SetString("923469700889501014")

	expectedFee.Mul(expectedFee, ethPriceUsd)

	expectedFee.Quo(expectedFee, ethereumDecimalsRat)

	legacyTransactionFee := calculateLegacyFeeTransactionFee(
		emission,
		transaction,
		ethPriceUsd,
		ethereumDecimalsRat,
	)

	assert.Equal(
		t,
		expectedFee.FloatString(10),
		legacyTransactionFee.FloatString(10),
		"fee not equal",
	)
}
