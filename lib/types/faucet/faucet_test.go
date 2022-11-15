// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package faucet

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestToken(t *testing.T) {
	token := TokenfDAI
	decimals, err := token.TokenDecimals()
	assert.EqualValues(t, 18, decimals)
	assert.NoError(t, err)

	token = TokenfUSDC
	decimals, err = token.TokenDecimals()
	assert.EqualValues(t, 6, decimals)
	assert.NoError(t, err)

	token = TokenfUSDT
	decimals, err = token.TokenDecimals()
	assert.EqualValues(t, 6, decimals)
	assert.NoError(t, err)

	token = "abc"
	decimals, err = token.TokenDecimals()
	assert.Zero(t, decimals)
	assert.Error(t, err)

	token, err = TokenFromString("fDAI")
	assert.Equal(t, TokenfDAI, token)
	assert.NoError(t, err)

	token, err = TokenFromString("fUSDC")
	assert.Equal(t, TokenfUSDC, token)
	assert.NoError(t, err)

	token, err = TokenFromString("fUSDT")
	assert.Equal(t, TokenfUSDT, token)
	assert.NoError(t, err)

	token, err = TokenFromString("a")
	assert.Zero(t, token)
	assert.Error(t, err)
}
