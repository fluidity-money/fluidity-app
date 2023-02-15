// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package dopex

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

const dopexSwapLogTopic = "0xd6d34547c69c5ee3d2667625c188acf1006abb93e0ee7cf03925c67cf7760413"

const dopexSwapAbiString = `[
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "receiver",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "inToken",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "outToken",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "inAmount",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "outAmount",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "convertedAmount",
          "type": "uint256"
        }
      ],
      "name": "Swap",
      "type": "event"
    }
]`

// dopexSwapAbi set by init.go to generate the ABI code
var dopexSwapAbi ethAbi.ABI

// GetDopexFees returns dopex 's fee of 0.7% of the amount swapped.
func GetDopexFees(transfer worker.EthereumApplicationTransfer, client *ethclient.Client, fluidTokenContract ethCommon.Address, tokenDecimals int) (*big.Rat, error) {
	// decode the amount of each token in the log
	// doesn't contain addresses, as they're indexed
	if len(transfer.Log.Topics) < 1 {
		return nil, fmt.Errorf("No log topics passed!")
	}

	logTopic := transfer.Log.Topics[0].String()

	if logTopic != dopexSwapLogTopic {
		return nil, nil
	}

	unpacked, err := dopexSwapAbi.Unpack("Swap", transfer.Log.Data)

	if err != nil {
		return nil, fmt.Errorf(
			"Failed to unpack swap log data! %v",
			err,
		)
	}

	if len(unpacked) != 6 {
		return nil, fmt.Errorf(
			"Unpacked the wrong number of values! Expected 6, got %v",
			len(unpacked),
		)
	}

	tokenAddrs_ := unpacked[1:3]

	tokenAddrs, err := ethereum.CoerceBoundContractResultsToAddresses(tokenAddrs_)

	if err != nil {
		return nil, fmt.Errorf(
			"Failed to coerce swap log data to addresses! %v",
			err,
		)
	}

	swapAmounts_ := unpacked[3:]

	swapAmounts, err := ethereum.CoerceBoundContractResultsToRats(swapAmounts_)

	if err != nil {
		return nil, fmt.Errorf(
			"Failed to coerce swap log data to rats! %v",
			err,
		)
	}

	var (
		// swap logs
		tokenIn         = tokenAddrs[0]
		amountIn        = swapAmounts[0]
		convertedAmount = swapAmounts[2]

		// the amount of fluid tokens sent or received
		fluidTransferAmount *big.Rat

		// the 0.7% fee
		feeMultiplier = big.NewRat(7, 1000)

		// whether the token being swapped from is the fluid token
		inTokenIsFluid = tokenIn == fluidTokenContract
	)

	if inTokenIsFluid {
		fluidTransferAmount = amountIn
	} else {
		fluidTransferAmount = convertedAmount
	}

	fee := new(big.Rat).Mul(fluidTransferAmount, feeMultiplier)

	// adjust by decimals to get the price in USD
	decimalsAdjusted := math.Pow10(tokenDecimals)
	decimalsRat := new(big.Rat).SetFloat64(decimalsAdjusted)

	fee.Quo(fee, decimalsRat)

	return fee, nil
}
