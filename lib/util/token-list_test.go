// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package util

import (
	"math/big"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestTokenList(t *testing.T) {
	const (
		ExpectedTokensListEthereum = `:USDT:6,:USDC:6,:DAI:18,:TUSD:18,:FEI:18,:FRAX:18,:UST:6`
		ExpectedTokensListSolana   = `:USDT:6,:USDC:6,:UXD:6,:UST:6`
	)

	var (
		expectedEthereumTokensList = []TokenDetailsBase{}
		expectedSolanaTokensList   = []TokenDetailsBase{}
	)

	resultEthereumTokensList := GetTokensListBase(ExpectedTokensListEthereum)

	resultSolanaTokensList := GetTokensListBase(ExpectedTokensListSolana)

	expectedEthereumTokensList = []TokenDetailsBase{
		{
			TokenName:     `USDT`,
			TokenDecimals: big.NewRat(1000000, 1),
		},
		{
			TokenName:     `USDC`,
			TokenDecimals: big.NewRat(1000000, 1),
		},
		{
			TokenName:     `DAI`,
			TokenDecimals: big.NewRat(1000000000000000000, 1),
		},
		{
			TokenName:     `TUSD`,
			TokenDecimals: big.NewRat(1000000000000000000, 1),
		},
		{
			TokenName:     `FEI`,
			TokenDecimals: big.NewRat(1000000000000000000, 1),
		},
		{
			TokenName:     `FRAX`,
			TokenDecimals: big.NewRat(1000000000000000000, 1),
		},
		{
			TokenName:     `UST`,
			TokenDecimals: big.NewRat(1000000, 1),
		},
	}

	expectedSolanaTokensList = []TokenDetailsBase{
		{
			TokenName:     `USDC`,
			TokenDecimals: big.NewRat(1000000, 1),
		},
		{
			TokenName:     `USDT`,
			TokenDecimals: big.NewRat(1000000, 1),
		},
		{
			TokenName:     `UXD`,
			TokenDecimals: big.NewRat(1000000, 1),
		},
		{
			TokenName:     `UST`,
			TokenDecimals: big.NewRat(1000000, 1),
		},
	}

	assert.ElementsMatch(t, expectedSolanaTokensList, resultSolanaTokensList)
	assert.ElementsMatch(t, expectedEthereumTokensList, resultEthereumTokensList)
}
