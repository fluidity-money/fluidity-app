// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package curve

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

func TestGetCurveSwapFee(t *testing.T) {
	const (
		// transfer blob containing a 11,085,756 USDC -> 11,084,525,138,889,162,879 DAI value swap
		dataBlobB64 = `"AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAKknvAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAmdQk4q9gQH8="`

		// response that can be parsed as a 1000000
		feeRpcResponse = "0x00000000000000000000000000000000000000000000000000000000000F42400000000000000000000000000000000000000000000000000000000000000000"

		// response that can be parsed as 0x0 address fee
		ethCoinsRpcResponse = "0x0000000000000000000000000000000000000000000000000000000000000000"
	)

	var (
		rpcMethods  = make(map[string]interface{})
		callMethods = make(map[string]interface{})
	)

	rpcMethods["eth_getCode"] = "0x0"
	callMethods["fee()"] = feeRpcResponse
	callMethods["coins(uint256)"] = ethCoinsRpcResponse

	// get the mocked client
	client, err := testUtils.MockRpcClient(rpcMethods, callMethods)
	assert.NoError(t, err)

	var (
		transfer       worker.EthereumApplicationTransfer
		fluidTokenAddr common.Address
		tokenDecimals  int = 6
	)

	// 2,500,000,000 = 2,500
	// expect first fee to be 2,500 * 0.1% = 25 USD
	// 2348810240 = 2,348.810240 * 0.101010101% = 23.72535596 USD
	dataBlob := new(misc.Blob)
	err = dataBlob.UnmarshalJSON([]byte(dataBlobB64))
	assert.NoError(t, err)

	// nil transfer fails
	fees, err := GetCurveSwapFees(transfer, client, fluidTokenAddr, tokenDecimals)
	assert.Error(t, err)
	assert.Nil(t, fees)

	transfer.Log.Topics = []ethTypes.Hash{
		ethTypes.HashFromString(""),
		ethTypes.HashFromString(""),
		ethTypes.HashFromString(""),
		ethTypes.HashFromString(""),
	}

	// nil data fails
	fees, err = GetCurveSwapFees(transfer, client, fluidTokenAddr, tokenDecimals)
	assert.Error(t, err)
	assert.Nil(t, fees)

	// fluid -> other successful
	transfer.Log.Data = *dataBlob
	fees, err = GetCurveSwapFees(transfer, client, fluidTokenAddr, tokenDecimals)
	assert.NoError(t, err)
	assert.Equal(t, big.NewRat(2771439, 2500000000), fees)

	// other -> other successful
	fluidTokenAddr = common.HexToAddress("0x6B175474E89094C44Da98b954EedeAC495271d0F")
	fees, err = GetCurveSwapFees(transfer, client, fluidTokenAddr, tokenDecimals)
	assert.Nil(t, err)
	assert.Nil(t, fees)

	// bad RPC responses
	// bad swap fee response
	fluidTokenAddr = common.HexToAddress("0x0000000000000000000000000000000000000000")
	callMethods["fee()"] = "t"
	client, err = testUtils.MockRpcClient(rpcMethods, callMethods)
	assert.NoError(t, err)

	fees, err = GetCurveSwapFees(transfer, client, fluidTokenAddr, tokenDecimals)
	assert.Nil(t, fees)
	assert.Error(t, err)

	// bad coins response
	callMethods["fee()"] = feeRpcResponse
	callMethods["coins(uint256)"] = "0x00"
	client, err = testUtils.MockRpcClient(rpcMethods, callMethods)
	assert.NoError(t, err)

	fees, err = GetCurveSwapFees(transfer, client, fluidTokenAddr, tokenDecimals)
	assert.Nil(t, fees)
	assert.Error(t, err)
}

type calculateCurveSwapFeeTest struct {
	soldAmount,
	boughtAmount,
	feeRate *big.Rat
	soldTokenIsFluid bool
	expectedFee      *big.Rat
}

func TestCalculateCurveSwapFee(t *testing.T) {
	tests := []calculateCurveSwapFeeTest{
		// It calculates fees on src token with same decimals
		{big.NewRat(100, 1), big.NewRat(99, 1), big.NewRat(1, 100), true, big.NewRat(1, 1)},

		// It calculates fees on dst token with same decimals
		{big.NewRat(100, 1), big.NewRat(99, 1), big.NewRat(1, 100), false, big.NewRat(1, 1)},

		// It calculates fees on src token with different decimals
		{big.NewRat(1000, 1), big.NewRat(99, 1), big.NewRat(1, 100), true, big.NewRat(10, 1)},

		// It calculates fees on dst token with different decimals
		{big.NewRat(1000, 1), big.NewRat(99, 1), big.NewRat(1, 100), false, big.NewRat(1, 1)},
	}

	for _, test := range tests {
		var (
			soldAmount       = test.soldAmount
			boughtAmount     = test.boughtAmount
			feeRate          = test.feeRate
			soldTokenIsFluid = test.soldTokenIsFluid
			expectedFee      = test.expectedFee
		)

		fluidFee := calculateCurveSwapFee(soldAmount, boughtAmount, feeRate, soldTokenIsFluid)

		assert.Equal(t, expectedFee, fluidFee)
	}
}
