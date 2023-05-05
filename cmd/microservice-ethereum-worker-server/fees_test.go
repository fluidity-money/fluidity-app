package main

import (
	"math/big"
	"testing"

	"github.com/fluidity-money/fluidity-app/lib/types/ethereum"
	"github.com/fluidity-money/fluidity-app/lib/types/worker"
	"github.com/fluidity-money/fluidity-app/lib/types/misc"
	"github.com/fluidity-money/fluidity-app/lib/log"

	"github.com/stretchr/testify/assert"
)

func TestCalculateLegacyFeeTransactionFee1(t *testing.T) {
	var (
		testGasUsed, _ = misc.BigIntFromString("6962458")
		testGasPrice, _ = misc.BigIntFromString("132635586583")
	)

	transaction := ethereum.Transaction{
		GasPrice: *testGasPrice,
	}

	receipt := ethereum.Receipt{
		GasUsed: *testGasUsed,
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
		receipt,
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

func TestCalculateLegacyFeeTransactionFee2(t *testing.T) {
	var (
		testGasUsed, _ = misc.BigIntFromString("8000000")
		testGasPrice, _ = misc.BigIntFromString("400000000")
	)

	receipt := ethereum.Receipt{
		GasUsed: *testGasUsed,
	}

	transaction := ethereum.Transaction{
		GasPrice: *testGasPrice,
	}

	emission := new(worker.Emission)

	// price of today

	ethPriceUsd := new(big.Rat).SetFloat64(1164.13)

	ethereumDecimalsRat := new(big.Rat).SetInt64(1e18)

	expectedFee, _ := new(big.Rat).SetString("206846700000000")

	expectedFee.Mul(expectedFee, ethPriceUsd)

	expectedFee.Quo(expectedFee, ethereumDecimalsRat)

	log.App(func(k *log.Log) {
		k.Format("%v", expectedFee.FloatString(2))
	})

	legacyTransactionFee := calculateLegacyFeeTransactionFee(
		emission,
		transaction,
		receipt,
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
