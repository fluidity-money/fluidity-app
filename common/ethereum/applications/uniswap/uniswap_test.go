// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package uniswap

import (
	"math/big"
	"testing"

	"github.com/ethereum/go-ethereum/common"
	"github.com/fluidity-money/fluidity-app/lib/types/ethereum"
	"github.com/fluidity-money/fluidity-app/lib/types/misc"
	"github.com/fluidity-money/fluidity-app/lib/types/worker"
	testUtils "github.com/fluidity-money/fluidity-app/tests/integrations/ethereum/util"
	"github.com/stretchr/testify/assert"
)

func TestGetUniswapV2Fees(t *testing.T) {
	const (
		dataBlobB64   = `"AAAAAAAAAAAAAAAAAAAAAAAAAAAAAACz19e45lkP0loAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMVgkbc="`
		dataBlobB64_2 = `"AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAE95DVfAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA="`
		dataBlobB64_3 = `"AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAT0LCxAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA="`
	)

	var (
		fluidTokenAddr common.Address
		transfer       worker.EthereumApplicationTransfer
		// an address that won't match the zero address, so we can say the fluid token is token1
		fluidTokenAddr2 = common.HexToAddress("0xabc")
		tokenDecimals   = 18

		rpcMethods  = make(map[string]interface{})
		callMethods = make(map[string]map[string]interface{})
	)

	// unmarshall the first data blob
	dataBlob := new(misc.Blob)
	err := dataBlob.UnmarshalJSON([]byte(dataBlobB64))
	assert.NoError(t, err)

	client, err := testUtils.MockRpcClient(rpcMethods, callMethods)
	assert.NoError(t, err)

	// nil transfer fails
	feeData, err := GetUniswapV2Fees(transfer, client, fluidTokenAddr, tokenDecimals)
	assert.Error(t, err)
	assert.Nil(t, feeData.Fee)

	// fails without proper rpc responses
	transfer.Log.Data = *dataBlob
	transfer.Log.Topics = []ethereum.Hash{
		ethereum.HashFromString(UniswapV2SwapLogTopic),
	}
	feeData, err = GetUniswapV2Fees(transfer, client, fluidTokenAddr, tokenDecimals)
	assert.Error(t, err)
	assert.Nil(t, feeData.Fee)

	// add the "token0" call to the client
	callMethods["token0()"] = map[string]interface{}{
		"": "0x0000000000000000000000000000000000000000000000000000000000000000",
	}
	callMethods["token1()"] = map[string]interface{}{
		"": "0x0000000000000000000000000000000000000000000000000000000000000abc",
	}
	rpcMethods["eth_getCode"] = "0x0"

	client, err = testUtils.MockRpcClient(rpcMethods, callMethods)
	assert.NoError(t, err)

	r, ok := new(big.Rat).SetString("4976280438497449851783/500000000000000000000")
	assert.True(t, ok)

	feeData, err = GetUniswapV2Fees(transfer, client, fluidTokenAddr, tokenDecimals)
	assert.NoError(t, err)
	assert.Equal(t, r, feeData.Fee)

	tokenDecimals = 6
	r, ok = new(big.Rat).SetString("9934320933/997000000")
	assert.True(t, ok)

	feeData, err = GetUniswapV2Fees(transfer, client, fluidTokenAddr2, tokenDecimals)
	assert.NoError(t, err)
	assert.Equal(t, r, feeData.Fee)

	// transfer 333,333,333
	err = dataBlob.UnmarshalJSON([]byte(dataBlobB64_2))
	assert.NoError(t, err)
	transfer.Log.Data = *dataBlob

	r, ok = new(big.Rat).SetString("999999999/1000000000")
	assert.True(t, ok)

	feeData, err = GetUniswapV2Fees(transfer, client, fluidTokenAddr2, tokenDecimals)
	assert.NoError(t, err)
	assert.Equal(t, r, feeData.Fee)

	// transfer 333,333,333 the other way
	err = dataBlob.UnmarshalJSON([]byte(dataBlobB64_3))
	assert.NoError(t, err)
	transfer.Log.Data = *dataBlob

	r, ok = new(big.Rat).SetString("39893259/39880000")
	assert.True(t, ok)

	feeData, err = GetUniswapV2Fees(transfer, client, fluidTokenAddr, tokenDecimals)
	assert.NoError(t, err)
	assert.Equal(t, r, feeData.Fee)
}

func TestGetUniswapV3Fees(t *testing.T) {
	const (
		dataBlobB64 = `"AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGA5EselnlwAAD////////////////////////////////////+WNlDJAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQxvh7mCN4sTZSAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPgi1gZVSHXISPj///////////////////////////////////////vImw=="`
		// dataBlobB64_2 = `"AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAE95DVfAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=="`
		dataBlobB64_2 = `"AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAE95DVfAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=="`
	)

	var (
		fluidTokenAddr common.Address
		transfer       worker.EthereumApplicationTransfer
		// an address that won't match the zero address, so we can say the fluid token is token1
		fluidTokenAddr2 = common.HexToAddress("0xabc")
		tokenDecimals   = 18

		rpcMethods  = make(map[string]interface{})
		callMethods = make(map[string]map[string]interface{})
	)

	// unmarshall the first data blob
	dataBlob := new(misc.Blob)
	err := dataBlob.UnmarshalJSON([]byte(dataBlobB64))
	assert.NoError(t, err)

	client, err := testUtils.MockRpcClient(rpcMethods, callMethods)
	assert.NoError(t, err)

	// nil transfer fails
	feeData, err := GetUniswapV3Fees(transfer, client, fluidTokenAddr, tokenDecimals)
	assert.Error(t, err)
	assert.Nil(t, feeData.Fee)

	// fails without proper rpc responses
	transfer.Log.Data = *dataBlob
	transfer.Log.Topics = []ethereum.Hash{
		ethereum.HashFromString(uniswapV3SwapLogTopic),
	}
	feeData, err = GetUniswapV3Fees(transfer, client, fluidTokenAddr, tokenDecimals)
	assert.Error(t, err)
	assert.Nil(t, feeData.Fee)

	// add the "token0" call to the client
	callMethods["token0()"] = map[string]interface{}{
		"": "0x0000000000000000000000000000000000000000000000000000000000000000",
	}
	callMethods["token1()"] = map[string]interface{}{
		"": "0x0000000000000000000000000000000000000000000000000000000000000abc",
	}
	callMethods["fee()"] = map[string]interface{}{
		"": "0x0000000000000000000000000000000000000000000000000000000000000064",
	}
	rpcMethods["eth_getCode"] = "0x0"

	client, err = testUtils.MockRpcClient(rpcMethods, callMethods)
	assert.NoError(t, err)

	r, ok := new(big.Rat).SetString("71/100")
	assert.True(t, ok)

	feeData, err = GetUniswapV3Fees(transfer, client, fluidTokenAddr, tokenDecimals)
	assert.NoError(t, err)
	assert.Equal(t, r, feeData.Fee)

	tokenDecimals = 6
	r, ok = new(big.Rat).SetString("1774825271/2499750000")
	assert.True(t, ok)

	feeData, err = GetUniswapV3Fees(transfer, client, fluidTokenAddr2, tokenDecimals)
	assert.NoError(t, err)
	assert.Equal(t, r, feeData.Fee)

	// transfer 16 -> 333,333,333
	err = dataBlob.UnmarshalJSON([]byte(dataBlobB64_2))
	assert.NoError(t, err)
	transfer.Log.Data = *dataBlob
	// invert the sign of a value so both numbers aren't positive
	(*dataBlob)[0] = 255

	r, ok = new(big.Rat).SetString("333333333/10000000000")
	assert.True(t, ok)

	feeData, err = GetUniswapV3Fees(transfer, client, fluidTokenAddr2, tokenDecimals)
	assert.NoError(t, err)
	assert.Equal(t, r, feeData.Fee)
}
