package main

import (
	"math/big"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestSendAmountFromAccountBalance(t *testing.T) {
	var (
		gas      = big.NewInt(21000)
		gasPrice = big.NewInt(2)
		balance  = big.NewInt(40000)
	)

	// balance is too low
	value, err := sendAmountFromAccountBalance(gas, gasPrice, balance)

	assert.Nil(t, value)
	assert.Error(t, err)

	// balance is high enough, expect 8000 to send
	balance = big.NewInt(50000)
	expected := big.NewInt(8000)

	value, err = sendAmountFromAccountBalance(gas, gasPrice, balance)

	assert.Equal(t, expected, value)
	assert.NoError(t, err)
}
