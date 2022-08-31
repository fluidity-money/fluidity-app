// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package api_fluidity_money

import (
	"math/big"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestAddressRequestToEthereumAddress(t *testing.T) {
	address := addressRequestToEthereumAddress("0xabc")
	assert.EqualValues(t, "abc", address)

	address = addressRequestToEthereumAddress("0xAbCDeF")
	assert.EqualValues(t, "abcdef", address)

	address = addressRequestToEthereumAddress("")
	assert.EqualValues(t, "", address)

	address = addressRequestToEthereumAddress("AbC")
	assert.EqualValues(t, "abc", address)

	address = addressRequestToEthereumAddress("AbCDeF")
	assert.EqualValues(t, "abcdef", address)
}

func TestValidArgFloat64ToBigrat(t *testing.T) {
	args := make(map[string]interface{})
	key := "testkey"

	// no args
	result, ok := validArgFloat64toBigrat(args, key)
	assert.False(t, ok)
	assert.Zero(t, result)
	
	// invalid arg
	args[key] = "some other type" 
	result, ok = validArgFloat64toBigrat(args, key)
	assert.False(t, ok)
	assert.Zero(t, result)

	// valid arg
	args[key] = 0.5 
	result, ok = validArgFloat64toBigrat(args, key)
	assert.True(t, ok)
	assert.Equal(t, big.NewRat(1, 2), result)
}

func TestValidArgInt64ToUInt64Bigrat(t *testing.T) {
	args := make(map[string]interface{})
	key := "testkey"

	// no args
	result, ok := validArgInt64toUInt64Bigrat(args, key)
	assert.False(t, ok)
	assert.Zero(t, result)
	
	// invalid arg
	args[key] = "some other type" 
	result, ok = validArgInt64toUInt64Bigrat(args, key)
	assert.False(t, ok)
	assert.Zero(t, result)

	// arg < 0
	args[key] = -2
	result, ok = validArgInt64toUInt64Bigrat(args, key)
	assert.False(t, ok)
	assert.Zero(t, result)

	// valid arg
	args[key] = 123
	result, ok = validArgInt64toUInt64Bigrat(args, key)
	assert.True(t, ok)
	assert.Equal(t, big.NewRat(123, 1), result)
}

func TestValidArgInt(t *testing.T) {
	args := make(map[string]interface{})
	key := "testkey"

	// no args
	result, ok := validArgInt(args, key)
	assert.False(t, ok)
	assert.Zero(t, result)
	
	// invalid arg
	args[key] = "some other type" 
	result, ok = validArgInt(args, key)
	assert.False(t, ok)
	assert.Zero(t, result)

	// valid arg
	args[key] = 123
	result, ok = validArgInt(args, key)
	assert.True(t, ok)
	assert.Equal(t, 123, result)
}

func TestValidArgString(t *testing.T) {
	args := make(map[string]interface{})
	key := "testkey"

	// no args
	result, ok := validArgString(args, key)
	assert.False(t, ok)
	assert.Zero(t, result)
	
	// invalid arg
	args[key] = 123
	result, ok = validArgString(args, key)
	assert.False(t, ok)
	assert.Zero(t, result)

	// valid arg
	args[key] = "valid string"
	result, ok = validArgString(args, key)
	assert.True(t, ok)
	assert.Equal(t, "valid string", result)
}
