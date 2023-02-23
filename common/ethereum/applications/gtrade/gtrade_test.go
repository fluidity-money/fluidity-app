// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package gtrade

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

func TestGetGTrade_v6_1SwapFee(t *testing.T) {
	const (
		// MarketClosed event
		dataBlobB64 = `"AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJgisVsszUlAHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAsAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA8BuedogAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB8veDp3y3Bt////////////////////////////////8y3SIuyKIK0="`

		// Test Manager
		storageT = "0x000000000000000000000000cfa6ebd475d89db04cad5a756fff1cb2bc5be33c"

		// Tranfer topic
		transferTopic = "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"
		// Transfer of 2,315,284,107,444,000,000 DAI
		transfer1Blob = `"AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAICGKoPpOlQA="`
		// Transfer of 3,858,806,845,740,000,000 DAI
		transfer2Blob = `"AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAANY08YaEtowA="`
	)

	var (
		rpcMethods  = make(map[string]interface{})
		callMethods = make(map[string]map[string]interface{})

		// totalling 6,174,090,953,184,000,000 DAI fees
		txReceipt ethTypes.Receipt
	)

	rpcMethods["eth_getCode"] = "0x0"

	callMethods["storageT()"] = map[string]interface{}{
		"": storageT,
	}

	// get the mocked client
	client, err := testUtils.MockRpcClient(rpcMethods, callMethods)
	assert.NoError(t, err)

	var (
		transfer       worker.EthereumApplicationTransfer
		fluidTokenAddr common.Address
		tokenDecimals  int = 18
		emptyLog       ethTypes.Log
		emptyHash      ethTypes.Hash
		transferLog1   ethTypes.Log
		transferLog2   ethTypes.Log
	)

	dataBlob := new(misc.Blob)
	err = dataBlob.UnmarshalJSON([]byte(dataBlobB64))
	assert.NoError(t, err)

	// nil transfer fails
	fees, err := GetGtradeV6_1Fees(transfer, client, fluidTokenAddr, tokenDecimals, txReceipt)
	assert.Error(t, err)
	assert.Nil(t, fees)

	transfer.Log.Topics = []ethTypes.Hash{
		ethTypes.HashFromString(""),
	}

	// fluid -> other successful
	transfer.Log.Data = *dataBlob
	transfer.Log.Topics[0] = ethTypes.HashFromString(gtradeV6_1FeesChargedLogTopic)

	dataBlob = new(misc.Blob)
	err = dataBlob.UnmarshalJSON([]byte(transfer1Blob))
	assert.NoError(t, err)

	transferLog1.Data = *dataBlob
	transferLog1.Topics = append(
		transferLog1.Topics,
		ethTypes.HashFromString(transferTopic),
		ethTypes.HashFromString(storageT),
		emptyHash,
	)

	transferLog2.Data = misc.Blob(transfer2Blob)
	err = dataBlob.UnmarshalJSON([]byte(transfer2Blob))
	assert.NoError(t, err)

	transferLog2.Data = *dataBlob
	transferLog2.Topics = append(
		transferLog2.Topics,
		ethTypes.HashFromString(transferTopic),
		ethTypes.HashFromString(storageT),
		emptyHash,
	)

	txReceipt.Logs = append(
		txReceipt.Logs,
		transfer.Log,
		transferLog1,
		emptyLog,
		emptyLog,
		emptyLog,
		emptyLog,
		transferLog2,
	)

	fees, err = GetGtradeV6_1Fees(transfer, client, fluidTokenAddr, tokenDecimals, txReceipt)
	assert.NoError(t, err)
	assert.Equal(t, big.NewRat(6174090953184000000, 1000000000000000000), fees)

	// Non-Fluid transfer
	fluidTokenAddr = common.HexToAddress("0x6B175474E89094C44Da98b954EedeAC495271d0F")
	fees, err = GetGtradeV6_1Fees(transfer, client, fluidTokenAddr, tokenDecimals, txReceipt)
	assert.Error(t, err)
	assert.Nil(t, fees)
}
