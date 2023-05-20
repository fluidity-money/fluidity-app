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
	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/types/applications"
	"github.com/fluidity-money/fluidity-app/lib/types/worker"
)

const oneInchFixedRateSwapLogTopic = "0x803540962ed9acbf87226c32486d71e1c86c2bdb208e771bab2fd8a626f61e89"

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
},
{
  "inputs": [],
  "name": "token0",
  "outputs": [
    {
      "internalType": "contract IERC20",
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
      "internalType": "contract IERC20",
      "name": "",
      "type": "address"
    }
  ],
  "stateMutability": "view",
  "type": "function"
}]`

var fixedRateSwapAbi ethAbi.ABI

// GetFixedRateSwapFees calculates fees from Swapping TokenA and TokenB performed by FixedRateSwap
// Because TokenA and TokenB are required to have the same decimals, the fee is the value that
// balances x TokenA + y TokenB + fee = const
func GetFixedRateSwapFees(transfer worker.EthereumApplicationTransfer, client *ethclient.Client, fluidTokenContract ethCommon.Address, tokenDecimals int) (applications.ApplicationFeeData, error) {
	var feeData applications.ApplicationFeeData

	if len(transfer.Log.Topics) < 1 {
		return feeData, fmt.Errorf("No log topics passed!")
	}

	logTopic := transfer.Log.Topics[0].String()

	if logTopic != oneInchFixedRateSwapLogTopic {
		return feeData, nil
	}

	unpacked, err := fixedRateSwapAbi.Unpack("Swap", transfer.Log.Data)

	if err != nil {
		return feeData, fmt.Errorf(
			"Failed to unpack swap log data! %v",
			err,
		)
	}

	if len(unpacked) != 2 {
		return feeData, fmt.Errorf(
			"Unpacked the wrong number of values! Expected 2, got %v",
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

	swapContract_ := transfer.Log.Address.String()
	swapContract := ethCommon.HexToAddress(swapContract_)

	// now get the pair's token0
	token0_, err := ethereum.StaticCall(client, swapContract, fixedRateSwapAbi, "token0")

	if err != nil {
		return feeData, fmt.Errorf(
			"Failed to get token0! %v",
			err,
		)
	}

	token0, err := ethereum.CoerceBoundContractResultsToAddress(token0_)

	if err != nil {
		return feeData, fmt.Errorf(
			"Failed to coerce token0 %v! %v",
			token0_,
			err,
		)
	}

	// now get the pair's token1
	token1_, err := ethereum.StaticCall(client, swapContract, fixedRateSwapAbi, "token1")

	if err != nil {
		return feeData, fmt.Errorf(
			"Failed to get token1! %v",
			err,
		)
	}

	token1, err := ethereum.CoerceBoundContractResultsToAddress(token1_)

	if err != nil {
		return feeData, fmt.Errorf(
			"Failed to coerce token1 %v! %v",
			token1_,
			err,
		)
	}

	if (token0 != fluidTokenContract) && (token1 != fluidTokenContract) {
		log.App(func(k *log.Log) {
			k.Format(
				"Received a 1Inch Fixed Rate Swap in transaction %#v not involving the fluid token - skipping!",
				transfer.TransactionHash.String(),
			)
		})

		return feeData, nil
	}

	var (
		// swap logs
		// token0Amount is the net difference of tokenA
		token0Amount = swapAmounts[0]
		// token1Amount is the net difference of tokenB
		token1Amount = swapAmounts[1]

		token0IsFluid = token0 == fluidTokenContract
	)

	if token0IsFluid {
		feeData.Volume = new(big.Rat).Set(token0Amount)
	} else {
		feeData.Volume = new(big.Rat).Set(token1Amount)
	}

	// fee is derived assuming token0 and token1 have the same decimals
	// token0Amount + token1Amount + fee == 0
	fee := new(big.Rat).Add(token0Amount, token1Amount)
	fee.Abs(fee)

	// adjust by decimals to get the price in USD
	decimalsAdjusted := math.Pow10(tokenDecimals)
	decimalsRat := new(big.Rat).SetFloat64(decimalsAdjusted)

	fee.Quo(fee, decimalsRat)
	feeData.Volume = feeData.Volume.Quo(feeData.Volume, decimalsRat)
	
	feeData.Fee = fee

	return feeData, nil
}
