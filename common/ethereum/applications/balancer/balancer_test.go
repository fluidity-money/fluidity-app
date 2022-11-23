// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package balancer

import (
	"math/big"
	"testing"

	"github.com/ethereum/go-ethereum/common"
	ethTypes "github.com/fluidity-money/fluidity-app/lib/types/ethereum"
	"github.com/fluidity-money/fluidity-app/lib/types/misc"
	"github.com/fluidity-money/fluidity-app/lib/types/worker"
	testUtils "github.com/fluidity-money/fluidity-app/tests/integrations/ethereum/util"
	"github.com/stretchr/testify/assert"
)

func TestHashTo32Bytes(t *testing.T) {
	var hash ethTypes.Hash = ethTypes.HashFromString("000")
	// 0
	assert.Equal(t, [32]byte{}, hashTo32Bytes(hash))

	// non-hex chars ignored
	hash = ethTypes.HashFromString("ghxn")
	assert.Equal(t, [32]byte{}, hashTo32Bytes(hash))

	// valid hex
	hash = ethTypes.HashFromString("0x101f66")
	assert.Equal(t, [32]byte{16, 31, 102}, hashTo32Bytes(hash))

	// 0x prefix optional
	hash = ethTypes.HashFromString("101f66")
	assert.Equal(t, [32]byte{16, 31, 102}, hashTo32Bytes(hash))

	// truncation if over 32 bytes
	hash = ethTypes.HashFromString("101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010")
	assert.Equal(t, [32]byte{
		16, 16, 16, 16, 16, 16, 16, 16,
		16, 16, 16, 16, 16, 16, 16, 16,
		16, 16, 16, 16, 16, 16, 16, 16,
		16, 16, 16, 16, 16, 16, 16, 16,
	}, hashTo32Bytes(hash))
}

func TestGetBalancerFees(t *testing.T) {
	const (
		// transfer blob containing a 2,500,000,000  -> 2,348,810,240 value swap
		dataBlobB64 = `"AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJUC+QAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAjAAAAAAAAA=="`
		// response that can be parsed as a 0.1% fee
		normalRpcResponse = "0x000000000000000000000000000000000000000000000000002386F26FC100000000000000000000000000000000000000000000000000000000000000000000"
	)

	var (
		rpcMethods  = make(map[string]interface{})
		callMethods = make(map[string]interface{})
	)

	rpcMethods["eth_getCode"] = "0x0"
	callMethods["getPool(bytes32)"] = normalRpcResponse
	callMethods["getSwapFeePercentage()"] = normalRpcResponse

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
	fees, err := GetBalancerFees(transfer, client, fluidTokenAddr, tokenDecimals)
	assert.Error(t, err)
	assert.Nil(t, fees)

	transfer.Log.Topics = []ethTypes.Hash{
		ethTypes.HashFromString(""),
		ethTypes.HashFromString(""),
		ethTypes.HashFromString(""),
		ethTypes.HashFromString(""),
	}

	// nil data fails
	fees, err = GetBalancerFees(transfer, client, fluidTokenAddr, tokenDecimals)
	assert.Error(t, err)
	assert.Nil(t, fees)

	// fluid -> other successful
	transfer.Log.Data = *dataBlob
	fees, err = GetBalancerFees(transfer, client, fluidTokenAddr, tokenDecimals)
	assert.NoError(t, err)
	assert.Equal(t, big.NewRat(25, 1), fees)

	// other -> fluid successful
	transfer.Log.Topics[2] = ethTypes.HashFromString("0x2")
	fees, err = GetBalancerFees(transfer, client, fluidTokenAddr, tokenDecimals)
	assert.NoError(t, err)
	assert.Equal(t, big.NewRat(7340032, 309375), fees)

	// other -> other successful
	transfer.Log.Topics[3] = ethTypes.HashFromString("0x3")
	fees, err = GetBalancerFees(transfer, client, fluidTokenAddr, tokenDecimals)
	assert.Nil(t, err)
	assert.Nil(t, fees)

	// bad RPC responses
	// bad swap fee response
	callMethods["getSwapFeePercentage()"] = "t"
	client, err = testUtils.MockRpcClient(rpcMethods, callMethods)
	assert.NoError(t, err)

	fees, err = GetBalancerFees(transfer, client, fluidTokenAddr, tokenDecimals)
	assert.Nil(t, fees)
	assert.Error(t, err)

	// bad pool response
	callMethods["getPool(bytes32)"] = "0x00"
	client, err = testUtils.MockRpcClient(rpcMethods, callMethods)
	assert.NoError(t, err)

	fees, err = GetBalancerFees(transfer, client, fluidTokenAddr, tokenDecimals)
	assert.Nil(t, fees)
	assert.Error(t, err)
}
