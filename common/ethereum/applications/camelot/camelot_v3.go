// Copyright 2024 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package camelot

import (
	"fmt"
	"math"
	"math/big"

	ethAbi "github.com/ethereum/go-ethereum/accounts/abi"
	ethCommon "github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/ethclient"
	"github.com/fluidity-money/fluidity-app/common/ethereum"
	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/types/applications"
	"github.com/fluidity-money/fluidity-app/lib/types/worker"
)

const camelotV3SwapLogTopic = "0xc42079f94a6350d7e6235f29174924f928cc2ac818eb64fed8004e115fbcca67"

const camelotV3AbiString = `[
	{
	"anonymous": false,
	"inputs": [
		{
			"indexed": true,
			"internalType": "address",
			"name": "sender",
			"type": "address"
		},
		{
			"indexed": true,
			"internalType": "address",
			"name": "recipient",
			"type": "address"
		},
		{
			"indexed": false,
			"internalType": "int256",
			"name": "amount0",
			"type": "int256"
		},
		{
			"indexed": false,
			"internalType": "int256",
			"name": "amount1",
			"type": "int256"
		},
		{
			"indexed": false,
			"internalType": "uint160",
			"name": "price",
			"type": "uint160"
		},
		{
			"indexed": false,
			"internalType": "uint128",
			"name": "liquidity",
			"type": "uint128"
		},
		{
			"indexed": false,
			"internalType": "int24",
			"name": "tick",
			"type": "int24"
		}
	],
	"name": "Swap",
	"type": "event"
	},
	{
	"inputs": [],
	"name": "token0",
	"outputs": [
	  {
		"internalType": "address",
		"name": "",
		"type": "address"
	  }
	],
	"stateMutability": "view",
	"type": "function"
	},
	{
	"inputs": [],
	"name": "token1",
	"outputs": [
	  {
		"internalType": "address",
		"name": "",
		"type": "address"
	  }
	],
	"stateMutability": "view",
	"type": "function"
	}
]`

// camelotV3Abi set by init.go to generate the ABI code
var camelotV3Abi ethAbi.ABI

// GetCamelotV3Fees returns the volume of a Camelot V3 swap.
// It does not yet support fee calculations and always sets the fee to 0
func GetCamelotV3Fees(transfer worker.EthereumApplicationTransfer, client *ethclient.Client, fluidTokenContract ethCommon.Address, tokenDecimals int) (applications.ApplicationFeeData, error) {
	var feeData applications.ApplicationFeeData
	// decode the amount of each token in the log
	// doesn't contain addresses, as they're indexed
	if len(transfer.Log.Topics) < 1 {
		return feeData, fmt.Errorf("No log topics passed!")
	}

	logTopic := transfer.Log.Topics[0].String()

	if logTopic != camelotV3SwapLogTopic {
		return feeData, nil
	}

	unpacked, err := camelotV3Abi.Unpack("Swap", transfer.Log.Data)

	if err != nil {
		return feeData, fmt.Errorf(
			"Failed to unpack swap log data! %v",
			err,
		)
	}

	if len(unpacked) != 5 {
		return feeData, fmt.Errorf(
			"Unpacked the wrong number of values! Expected 5, got %v",
			len(unpacked),
		)
	}

	swapAmounts, err := ethereum.CoerceBoundContractResultsToRats(unpacked)

	if err != nil {
		return feeData, fmt.Errorf(
			"Failed to coerce swap log data to rats! %v",
			err,
		)
	}

	// convert the pair contract's address to the go ethereum address type
	contractAddr := ethereum.ConvertInternalAddress(transfer.Log.Address)

	// figure out which token is which in the pair contract
	token0addr_, err := ethereum.StaticCall(client, contractAddr, camelotV3Abi, "token0")

	if err != nil {
		return feeData, fmt.Errorf(
			"Failed to get token0 address! %v",
			err,
		)
	}

	token0addr, err := ethereum.CoerceBoundContractResultsToAddress(token0addr_)

	if err != nil {
		return feeData, fmt.Errorf(
			"Failed to coerce token0 address! %v",
			err,
		)
	}

	token1addr_, err := ethereum.StaticCall(client, contractAddr, camelotV3Abi, "token1")

	if err != nil {
		return feeData, fmt.Errorf(
			"Failed to get token1 address! %v",
			err,
		)
	}

	token1addr, err := ethereum.CoerceBoundContractResultsToAddress(token1addr_)

	if err != nil {
		return feeData, fmt.Errorf(
			"Failed to coerce token1 address! %v",
			err,
		)
	}

	var (
		// swap logs
		amount0 = swapAmounts[0]
		amount1 = swapAmounts[1]

		// the amount of fluid tokens sent or received
		fluidTransferAmount *big.Rat
	)

	// If amount0 is negative, then amount1 is paid out
	var (
		// Whether token0 is the fluid token
		token0IsFluid = token0addr == fluidTokenContract

		// Whether swap contains any fluid tokens
		swapContainsFluid = token0IsFluid || (token1addr == fluidTokenContract)

		zeroRat = big.NewRat(0, 1)
		// Whether amount0 is less than zero
		amount0IsNeg = amount0.Cmp(zeroRat) < 0
	)

	switch true {
	case !swapContainsFluid:
		log.App(func(k *log.Log) {
			k.Format(
				"Received a Camelot V3 swap in transaction %#v not involving the fluid token - skipping!",
				transfer.TransactionHash.String(),
			)
		})

		return feeData, nil

	case token0IsFluid && amount0IsNeg:
		fluidTransferAmount = new(big.Rat).Mul(amount0, big.NewRat(-1, 1))

	case token0IsFluid && !amount0IsNeg:
		fluidTransferAmount = amount0

	case !token0IsFluid && amount0IsNeg:
		fluidTransferAmount = amount1

	case !token0IsFluid && !amount0IsNeg:
		fluidTransferAmount = new(big.Rat).Mul(amount1, big.NewRat(-1, 1))
	}

	// adjust by decimals to get the price in USD
	decimalsAdjusted := math.Pow10(tokenDecimals)
	decimalsRat := new(big.Rat).SetFloat64(decimalsAdjusted)

	fluidTransferAmount.Quo(fluidTransferAmount, decimalsRat)

	feeData.Fee = big.NewRat(0, 1)
	feeData.Volume = fluidTransferAmount

	return feeData, nil
}
