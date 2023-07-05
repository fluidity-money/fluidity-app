// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package wombat

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
	wombatSwapLogTopic     = "0x54787c404bb33c88e86f4baf88183a3b0141d0a848e6a9f7a13b66ae3a9b73d1"
	FeeDenominatorExponent = 18
)

const wombatPairAbiString = `[
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
        "internalType": "address",
        "name": "fromToken",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "toToken",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "fromAmount",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "toAmount",
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
    "name": "haircutRate",
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

var wombatPairAbi ethAbi.ABI

// GetWombatFees returns Wombat's fee based on fees given by the
// swap log
func GetWombatFees(transfer worker.EthereumApplicationTransfer, client *ethclient.Client, fluidTokenContract ethCommon.Address, tokenDecimals int) (applications.ApplicationFeeData, error) {
	var feeData applications.ApplicationFeeData

	// decode the amount of each token in the log
	// doesn't contain addresses, as they're indexed
	if len(transfer.Log.Topics) < 1 {
		return feeData, fmt.Errorf("No log topics passed!")
	}

	logTopic := transfer.Log.Topics[0].String()

	if logTopic != wombatSwapLogTopic {
		return feeData, nil
	}

	unpacked, err := wombatPairAbi.Unpack("Swap", transfer.Log.Data)

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

	// first 2 values are tokens in and out
	tokenAddresses, err := ethereum.CoerceBoundContractResultsToAddresses(unpacked[0:2])

	if err != nil {
		return feeData, fmt.Errorf(
			"Failed to coerce swap token to addresses! %v",
			err,
		)
	}

	// second 2 values are swap amounts in and out
	swapAmounts, err := ethereum.CoerceBoundContractResultsToRats(unpacked[2:4])

	if err != nil {
		return feeData, fmt.Errorf(
			"Failed to coerce swap log data to rats! %v",
			err,
		)
	}

	// convert the pair contract's address to the go ethereum address type
	contractAddr := ethereum.ConvertInternalAddress(transfer.Log.Address)

	// get the haircut rate
	feeNumerator_, err := ethereum.StaticCall(client, contractAddr, wombatPairAbi, "haircutRate")

	if err != nil {
		return feeData, fmt.Errorf(
			"Failed to get fee numerator! %v",
			err,
		)
	}

	feeNumerator, err := ethereum.CoerceBoundContractResultsToRat(feeNumerator_)

	if err != nil {
		return feeData, fmt.Errorf(
			"Failed to coerce fee numerator! %v",
			err,
		)
	}

	var (
		// swap logs
		tokenIn   = tokenAddresses[0]
		tokenOut  = tokenAddresses[1]
		amountIn  = swapAmounts[0]
		amountOut = swapAmounts[1]

		// the amount of fluid tokens sent or received
		fluidTransferAmount *big.Rat

		// whether the token being swapped from is the fluid token
		inTokenIsFluid = tokenIn == fluidTokenContract

		// Whether swap contains any fluid tokens
		swapContainsFluid = inTokenIsFluid || (tokenOut == fluidTokenContract)
	)

	if !swapContainsFluid {
		log.App(func(k *log.Log) {
			k.Format(
				"Received a Wombat swap in transaction %#v not involving the fluid token - skipping!",
				transfer.TransactionHash.String(),
			)
		})

		return feeData, nil
	}

	if inTokenIsFluid {
		fluidTransferAmount = amountIn
	} else {
		fluidTransferAmount = amountOut
	}

	// denominator of the fee
	feeDenominator := new(big.Rat).SetInt(new(big.Int).Exp(big.NewInt(10), big.NewInt(FeeDenominatorExponent), big.NewInt(0)))

	feeMultiplier := new(big.Rat).Quo(feeNumerator, feeDenominator)

	// if the out amount is fluid, then we have to recover the amount from before the fee was taken
	// amount - fee*amount = loggedAmount
	// amount*(1-fee) = loggedAmount
	// amount = loggedAmount/(1-fee)
	if !inTokenIsFluid {
		fluidTransferAmount = fluidTransferAmount.Quo(fluidTransferAmount, new(big.Rat).Sub(big.NewRat(1, 1), feeMultiplier))
	}

	feeData.Volume = new(big.Rat).Set(fluidTransferAmount)

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
