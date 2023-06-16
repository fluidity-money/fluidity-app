// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package chronos

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

const (
	chronosSwapLogTopic       = "0xd78ad95fa46c994b6551d0da85fc275fe613ce37657fb8d5e3d130840159d822"
	chronosPairFactoryAddress = "0xce9240869391928253ed9cc9bcb8cb98cb5b0722"
	FeeDenominator            = 10000
)

const chronosPairAbiString = `[
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
        "indexed": false,
        "internalType": "uint256",
        "name": "amount0In",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount1In",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount0Out",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount1Out",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "to",
        "type": "address"
      }
    ],
    "name": "Swap",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "isStable",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
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

const chronosPairFactoryAbiString = `[
  {
  "inputs": [
    {
    "internalType": "bool",
    "name": "_stable",
    "type": "bool"
    }
  ],
  "name": "getFee",
  "outputs": [
    {
    "internalType": "uint256",
    "name": "",
    "type": "uint256"
    }
  ],
  "stateMutability": "view",
  "type": "function"
  }
]`

var (
	// chronosPairAbi set by init.go to generate the ABI code
	chronosPairAbi ethAbi.ABI
	// chronosPairFactoryAbi set by init.go to generathe the ABI code for the factory
	chronosPairFactoryAbi ethAbi.ABI
)

// GetChronosFees returns Chronos' fee based on fees given by Chronos' pair factory
// If the token swapped from was the fluid token, get the exact amount,
// otherwise approximate the cost based on the received amount of the fluid token
func GetChronosFees(transfer worker.EthereumApplicationTransfer, client *ethclient.Client, fluidTokenContract ethCommon.Address, tokenDecimals int) (applications.ApplicationFeeData, error) {
	var feeData applications.ApplicationFeeData

	// decode the amount of each token in the log
	// doesn't contain addresses, as they're indexed
	if len(transfer.Log.Topics) < 1 {
		return feeData, fmt.Errorf("No log topics passed!")
	}

	logTopic := transfer.Log.Topics[0].String()

	if logTopic != chronosSwapLogTopic {
		return feeData, nil
	}

	unpacked, err := chronosPairAbi.Unpack("Swap", transfer.Log.Data)

	if err != nil {
		return feeData, fmt.Errorf(
			"Failed to unpack swap log data! %v",
			err,
		)
	}

	if len(unpacked) != 4 {
		return feeData, fmt.Errorf(
			"Unpacked the wrong number of values! Expected 4, got %v",
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
	// convert the factory contract's address to the go ethereum address type
	factoryAddr := ethCommon.HexToAddress(chronosPairFactoryAddress)

	// figure out which token is which in the pair contract
	token0addr_, err := ethereum.StaticCall(client, contractAddr, chronosPairAbi, "token0")

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

	token1addr_, err := ethereum.StaticCall(client, contractAddr, chronosPairAbi, "token1")

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
		amount0in  = swapAmounts[0]
		amount1in  = swapAmounts[1]
		amount0out = swapAmounts[2]
		amount1out = swapAmounts[3]

		// the amount of fluid tokens sent or received
		fluidTransferAmount *big.Rat

		// the multiplier to find the fee
		feeMultiplier *big.Rat

		// whether the token being swapped from is the fluid token
		inTokenIsFluid = false
	)

	// fluid index 0  0, x, y, 0 = swapping x token for y fluid
	// fluid index 0  x, 0, 0, y = swapping x fluid for y token
	// fluid index 1  0, x, y, 0 = swapping x fluid for y token
	// fluid index 1  x, 0, 0, y = swapping x token for y fluid

	var (
		// Whether token0 is the fluid token
		fluidIndex0 = token0addr == fluidTokenContract
		// Whether swap contains any fluid tokens
		swapContainsFluid = fluidIndex0 || (token1addr == fluidTokenContract)
		// Whether amount0 is equal to zero
		amount0IsZero = amount0in.Sign() == 0
	)

	switch true {
	case !swapContainsFluid:
		log.App(func(k *log.Log) {
			k.Format(
				"Received a Chronos swap in transaction %#v not involving the fluid token - skipping!",
				transfer.TransactionHash.String(),
			)
		})

		return feeData, nil

	case fluidIndex0 && amount0IsZero:
		inTokenIsFluid = false
		fluidTransferAmount = amount0out

	case fluidIndex0 && !amount0IsZero:
		inTokenIsFluid = true
		fluidTransferAmount = amount0in

	case !fluidIndex0 && amount0IsZero:
		inTokenIsFluid = true
		fluidTransferAmount = amount1in

	case !fluidIndex0 && !amount0IsZero:
		inTokenIsFluid = false
		fluidTransferAmount = amount1out
	}

	feeData.Volume = fluidTransferAmount

	// figure out whether our pair is stable
	stable_, err := ethereum.StaticCall(client, contractAddr, chronosPairAbi, "isStable")

	if err != nil {
		return feeData, fmt.Errorf(
			"Failed to get pair isStable! %v",
			err,
		)
	}

	stable, err := ethereum.CoerceBoundContractResultsToBool(stable_)

	if err != nil {
		return feeData, fmt.Errorf(
			"Failed to coerce isStable bool! %v",
			err,
		)
	}

	// numerator of the fee (must be a call to the pair contract with the token in)
	feeNumerator_, err := ethereum.StaticCall(client, factoryAddr, chronosPairFactoryAbi, "getFee", stable)

	if err != nil {
		return feeData, fmt.Errorf(
			"Failed to get pair fee numerator! %v",
			err,
		)
	}

	feeNumerator, err := ethereum.CoerceBoundContractResultsToInt(feeNumerator_)

	if err != nil {
		return feeData, fmt.Errorf(
			"Failed to coerce pair fee numerator! %v",
			err,
		)
	}

	feeMultiplier = new(big.Rat).SetFrac(feeNumerator, big.NewInt(FeeDenominator))

	// if the out amount is fluid, then we have to recover the amount from before the fee was taken
	// amount - fee*amount = loggedAmount
	// amount*(1-fee) = loggedAmount
	// amount = loggedAmount/(1-fee)
	if !inTokenIsFluid {
		fluidTransferAmount = fluidTransferAmount.Quo(fluidTransferAmount, new(big.Rat).Sub(big.NewRat(1, 1), feeMultiplier))
	}

	fee := new(big.Rat).Set(fluidTransferAmount)
	fee = fee.Mul(fee, feeMultiplier)

	// adjust by decimals to get the price in USD
	decimalsAdjusted := math.Pow10(tokenDecimals)
	decimalsRat := new(big.Rat).SetFloat64(decimalsAdjusted)

	fee.Quo(fee, decimalsRat)
	feeData.Volume.Quo(feeData.Volume, decimalsRat)

	feeData.Fee = fee

	return feeData, nil
}
