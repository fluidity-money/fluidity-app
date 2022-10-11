// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package main

import (
	"encoding/json"
	"math/big"
	"testing"

	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/ethclient"
	"github.com/fluidity-money/fluidity-app/common/ethereum/applications"
	test_utils "github.com/fluidity-money/fluidity-app/tests/integrations/ethereum/util"

	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/queues/worker"
	"github.com/fluidity-money/fluidity-app/lib/types/ethereum"
	"github.com/stretchr/testify/assert"
)

type integrationTest struct {
	// Transfer.Log.Data JSON must be base64
	Transfer worker.EthereumApplicationTransfer `json:"transfer"`
	// ExpectedSender to receive a majority payout
	ExpectedSender ethereum.Address `json:"expected_sender"`
	// ExpectedReceiver to receive a minority mayout
	ExpectedRecipient ethereum.Address `json:"expected_recipient"`

	// of a form parseable by big.Rat, e.g. 940/27
	ExpectedFees string `json:"expected_fees"`

	ExpectedEmission worker.EthereumAppFees `json:"expected_emission"`

	FluidTokenDecimals   int            `json:"token_decimals"`
	FluidContractAddress common.Address `json:"contract_address"`

	RpcMethods  map[string]interface{} `json:"rpc_methods"`
	CallMethods map[string]interface{} `json:"call_methods"`

	Client *ethclient.Client
}

var tests []integrationTest

func unmarshalJsonTestOrFatal(jsonStr string) []integrationTest {
	var tests []integrationTest

	if err := json.Unmarshal([]byte(jsonStr), &tests); err != nil {
		log.Fatal(func(k *log.Log) {
			k.Format(
				"Failed to initialise JSON tests for string %v! %v",
				jsonStr,
				err,
			)
		})
	}

	// initialise mocked client with responses
	for i, test := range tests {
		var (
			rpcMethods = test.RpcMethods
			callMethods = test.CallMethods
		)

		client, err  := test_utils.MockRpcClient(rpcMethods, callMethods)

		if err != nil {
			log.Fatal(func(k *log.Log) {
				k.Format(
					"Failed to initialise mocked client! %v",
					err,
				)
			})
		}

		tests[i].Client = client
	}

	return tests
}

// collate all tests defined in JSON strings
func init() {
	balancerTests := unmarshalJsonTestOrFatal(integrationTestBalancerV2)
	tests = append(tests, balancerTests...)

	uniswapTests := unmarshalJsonTestOrFatal(integrationTestUniswapV2)
	tests = append(tests, uniswapTests...)

	dodoTests := unmarshalJsonTestOrFatal(integrationTestDodoV2)
	tests = append(tests, dodoTests...)

	sushiswapTests := unmarshalJsonTestOrFatal(integrationTestSushiswap)
	tests = append(tests, sushiswapTests...)
}

func TestIntegrations(t *testing.T) {

	for i, event := range tests {
		t.Logf("Event %d\n", i)

		var (
			transfer      = event.Transfer
			fluidAddress  = event.FluidContractAddress
			tokenDecimals = event.FluidTokenDecimals
			client        = event.Client
		)

		fees, emission, err := applications.GetApplicationFee(
			transfer,
			client,
			fluidAddress,
			tokenDecimals,
			nil,
		)

		assert.NoError(t, err)

		sender, recipient, err := applications.GetApplicationTransferParties(event.Transfer)
		assert.NoError(t, err)

		// correct sender, recipient
		assert.Equal(t, event.ExpectedSender, sender)
		assert.Equal(t, event.ExpectedRecipient, recipient)

		// correct fees
		expectedFeesRat, ok := new(big.Rat).SetString(event.ExpectedFees)
		assert.True(t, ok)
		assert.Equal(t, expectedFeesRat, fees)

		// correct emission
		assert.Equal(t, event.ExpectedEmission, emission)
	}
}
