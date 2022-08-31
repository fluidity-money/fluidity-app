// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package oneinch

import (
	"fmt"
	"math"
	"math/big"

	ethAbi "github.com/ethereum/go-ethereum/accounts/abi"
	ethCommon "github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/ethclient"
	"github.com/fluidity-money/fluidity-app/common/ethereum"
	"github.com/fluidity-money/fluidity-app/lib/types/worker"
)

const fixedRateSwapAbiString = `[
{
	"anonymous": false,
	"inputs": [
		{
			"indexed": true,
			"internalType": "address",
			"name": "trader",
			"type": "address"
		},
		{
			"indexed": false,
			"internalType": "int256",
			"name": "token0Amount",
			"type": "int256"
		},
		{
			"indexed": false,
			"internalType": "int256",
			"name": "token1Amount",
			"type": "int256"
		}
	],
	"name": "Swap",
	"type": "event"
}]`

var fixedRateSwapAbi ethAbi.ABI

// GetFixedRateSwapFees calculates fees from Swapping TokenA and TokenB performed by FixedRateSwap
// Because TokenA and TokenB are required to have the same decimals, the fee is the value that
// balances x TokenA + y TokenB + fee = const
func GetFixedRateSwapFees(transfer worker.EthereumApplicationTransfer, client *ethclient.Client, fluidTokenContract ethCommon.Address, tokenDecimals int) (*big.Rat, error) {
	unpacked, err := fixedRateSwapAbi.Unpack("Swap", transfer.Log.Data)

	if err != nil {
		return nil, fmt.Errorf(
			"Failed to unpack swap log data! %v",
			err,
		)
	}

	if len(unpacked) != 2 {
		return nil, fmt.Errorf(
			"Unpacked the wrong number of values! Expected 2, got %v",
			len(unpacked),
		)
	}

	swapAmounts, err := ethereum.CoerceBoundContractResultsToRats(unpacked)

	if err != nil {
		return nil, fmt.Errorf(
			"Failed to coerce swap log data to rats! %v",
			err,
		)
	}

	var (
		// swap logs
		// token0Amount is the net difference of tokenA
		token0Amount = swapAmounts[0]
		// token1Amount is the net difference of tokenB
		token1Amount = swapAmounts[1]
	)

	// fee is derived assuming token0 and token1 have the same decimals
	// token0Amount + token1Amount + fee == 0
	fee := new(big.Rat).Add(token0Amount, token1Amount)
	fee.Abs(fee)

	// adjust by decimals to get the price in USD
	decimalsAdjusted := math.Pow10(tokenDecimals)
	decimalsRat := new(big.Rat).SetFloat64(decimalsAdjusted)

	fee.Quo(fee, decimalsRat)

	return fee, nil
}
