// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package multichain

import (
	"math/big"
	"testing"

	"github.com/stretchr/testify/assert"

	"github.com/ethereum/go-ethereum/common"
	ethTypes "github.com/fluidity-money/fluidity-app/lib/types/ethereum"
	"github.com/fluidity-money/fluidity-app/lib/types/misc"
	"github.com/fluidity-money/fluidity-app/lib/types/worker"
	testUtils "github.com/fluidity-money/fluidity-app/tests/integrations/ethereum/util"
)

func TestGetMultichainAnySwapFee(t *testing.T) {
	const (
		// transfer blob containing a 1,400,000,000,000,000,000 anyWETH value swap
		dataBlobB64 = `"AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAE23MlR2MAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4"`

		// response that can be parsed as 0x0 address
		ethTokenRpcResponse = "0x0000000000000000000000000000000000000000000000000000000000000000"
	)

	var (
		rpcMethods  = make(map[string]interface{})
		callMethods = make(map[string]interface{})
	)

	rpcMethods["eth_getCode"] = "0x0"
	callMethods["underlying()"] = ethTokenRpcResponse

	// get the mocked client
	client, err := testUtils.MockRpcClient(rpcMethods, callMethods)
	assert.NoError(t, err)

	var (
		transfer       worker.EthereumApplicationTransfer
		fluidTokenAddr common.Address
		tokenDecimals  int = 18
	)

	dataBlob := new(misc.Blob)
	err = dataBlob.UnmarshalJSON([]byte(dataBlobB64))
	assert.NoError(t, err)

	// nil transfer fails
	fees, err := GetMultichainAnySwapFees(transfer, client, fluidTokenAddr, tokenDecimals)
	assert.Error(t, err)
	assert.Nil(t, fees)

	transfer.Log.Topics = []ethTypes.Hash{
		ethTypes.HashFromString(""),
		ethTypes.HashFromString(""),
		ethTypes.HashFromString(""),
		ethTypes.HashFromString(""),
	}

	// nil data fails
	fees, err = GetMultichainAnySwapFees(transfer, client, fluidTokenAddr, tokenDecimals)
	assert.Error(t, err)
	assert.Nil(t, fees)

	// fluid -> other successful
	transfer.Log.Data = *dataBlob
	fees, err = GetMultichainAnySwapFees(transfer, client, fluidTokenAddr, tokenDecimals)
	assert.NoError(t, err)
	assert.Equal(t, big.NewRat(40, 1), fees)

	// other -> other successful
	fluidTokenAddr = common.HexToAddress("0x6B175474E89094C44Da98b954EedeAC495271d0F")
	fees, err = GetMultichainAnySwapFees(transfer, client, fluidTokenAddr, tokenDecimals)
	assert.Nil(t, err)
	assert.Nil(t, fees)

	// bad RPC responses
	// bad underlying response
	callMethods["underlying()"] = "0x00"
	client, err = testUtils.MockRpcClient(rpcMethods, callMethods)
	assert.NoError(t, err)

	fees, err = GetMultichainAnySwapFees(transfer, client, fluidTokenAddr, tokenDecimals)
	assert.Nil(t, fees)
	assert.Error(t, err)
}

type calculateMultichainAnySwapFeeTest struct {
	amount,
	decimalsRat,
	expectedFee *big.Rat
}

func TestCalculateMultichainSwapFee(t *testing.T) {
	tests := []calculateMultichainAnySwapFeeTest{
		// It calculates fees > $40
		{big.NewRat(12345000, 1), big.NewRat(100, 1), big.NewRat(12345, 100)},

		// It calculates fees < $40
		{big.NewRat(12345000, 1), big.NewRat(1000, 1), big.NewRat(40, 1)},

		// It calculates fees > $1000
		{big.NewRat(12345000, 1), big.NewRat(10, 1), big.NewRat(1000, 1)},
	}

	for _, test := range tests {
		var (
			soldAmount  = test.amount
			decimalsRat = test.decimalsRat
			expectedFee = test.expectedFee
		)

		fluidFee := calculateMultichainAnySwapFee(soldAmount, decimalsRat)

		assert.Equal(t, expectedFee, fluidFee)
	}
}
