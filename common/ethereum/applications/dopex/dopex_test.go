// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package dopex

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

func TestGetDopexFees(t *testing.T) {
	const (
		dataBlobB64 = `"AAAAAAAAAAAAAAAAIVtbJad3sgnCG67jpoAzt0Y36ukAAAAAAAAAAAAAAABrF1R06JCUxE2pi5VO7erElScdDwAAAAAAAAAAAAAAANrBf5WNLuUjoiBiBplFl8E9gx7HAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAG8FtZ07IAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB5QlwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHodM"`
	)

	var (
		fluidTokenAddr common.Address
		transfer       worker.EthereumApplicationTransfer
		tokenDecimals  = 6

		rpcMethods  = make(map[string]interface{})
		callMethods = make(map[string]interface{})
	)

	// unmarshall the first data blob
	dataBlob := new(misc.Blob)
	err := dataBlob.UnmarshalJSON([]byte(dataBlobB64))
	assert.NoError(t, err)

	client, err := testUtils.MockRpcClient(rpcMethods, callMethods)
	assert.NoError(t, err)

	// nil transfer fails
	fees, err := GetDopexFees(transfer, client, fluidTokenAddr, tokenDecimals)
	assert.Error(t, err)
	assert.Nil(t, fees)

	// fails without proper rpc responses
	transfer.Log.Data = *dataBlob
	transfer.Log.Topics = []ethereum.Hash{
		ethereum.HashFromString(dopexSwapLogTopic),
	}

	r, ok := new(big.Rat).SetString("14005012/1000000000")
	assert.True(t, ok)

	fees, err = GetDopexFees(transfer, client, fluidTokenAddr, tokenDecimals)
	assert.NoError(t, err)
	assert.Equal(t, r, fees)

	tokenDecimals = 18
	r, ok = new(big.Rat).SetString("14000000000000000000/1000000000000000000000")
	assert.True(t, ok)

	fees, err = GetDopexFees(
		transfer,
		client,
		common.HexToAddress("0x6B175474E89094C44Da98b954EedeAC495271d0F"),
		tokenDecimals,
	)
	assert.NoError(t, err)
	assert.Equal(t, r, fees)
}
