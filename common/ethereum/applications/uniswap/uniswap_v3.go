// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package uniswap

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

const uniswapV3SwapLogTopic = "0xc42079f94a6350d7e6235f29174924f928cc2ac818eb64fed8004e115fbcca67"

const uniswapV3PairAbiString = `[
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
        "name": "sqrtPriceX96",
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
    "name": "fee",
    "outputs": [
      {
        "internalType": "uint24",
        "name": "",
        "type": "uint24"
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

// uniswapV3PairAbi set by init.go to generate the ABI code
var uniswapV3PairAbi ethAbi.ABI

// GetUniswapV3Fees returns Uniswap V3's fee of the amount swapped.
// The fee is dependent on the pool being swapped on
func GetUniswapV3Fees(transfer worker.EthereumApplicationTransfer, client *ethclient.Client, fluidTokenContract ethCommon.Address, tokenDecimals int) (applications.ApplicationFeeData, error) {
	var feeData applications.ApplicationFeeData
	// decode the amount of each token in the log
	// doesn't contain addresses, as they're indexed
	if len(transfer.Log.Topics) < 1 {
		return feeData, fmt.Errorf("No log topics passed!")
	}

	logTopic := transfer.Log.Topics[0].String()

	if logTopic != uniswapV3SwapLogTopic {
		return feeData, nil
	}

	unpacked, err := uniswapV3PairAbi.Unpack("Swap", transfer.Log.Data)

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
	token0addr_, err := ethereum.StaticCall(client, contractAddr, uniswapV3PairAbi, "token0")

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

	token1addr_, err := ethereum.StaticCall(client, contractAddr, uniswapV3PairAbi, "token1")

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

	poolFee_, err := ethereum.StaticCall(client, contractAddr, uniswapV3PairAbi, "fee")

	if err != nil {
		return feeData, fmt.Errorf(
			"Failed to get pool fee! %v",
			err,
		)
	}

	poolFee, err := ethereum.CoerceBoundContractResultsToRat(poolFee_)

	poolFee = new(big.Rat).Mul(poolFee, big.NewRat(1, 1000000))

	if err != nil {
		return feeData, fmt.Errorf(
			"Failed to coerce pool fee! %v",
			err,
		)
	}

	var (
		// swap logs
		amount0 = swapAmounts[0]
		amount1 = swapAmounts[1]

		// the amount of fluid tokens sent or received
		fluidTransferAmount *big.Rat

		// the multiplier to find the fee
		feeMultiplier *big.Rat
	)

	// If amount0 is negative, then amount1 is paid out
	var (
		// Whether token0 is the fluid token
		token0IsFluid = token0addr == fluidTokenContract

		// Whether swap contains any fluid tokens
		swapContainsFluid = token0IsFluid || (token1addr == fluidTokenContract)

		zeroRat = big.NewRat(0, 1)
		// Whether amount0 is equal to zero
		amount0IsNeg = amount0.Cmp(zeroRat) == 0
	)

	switch true {
	case !swapContainsFluid:
		log.App(func(k *log.Log) {
			k.Format(
				"Received a UniswapV3 swap in transaction %#v not involving the fluid token - skipping!",
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

	// if trading x fUSDC -> y Token B
	// the fee is x * 0.003 (100% input -> 99.7%)
	// if trading y Token B -> x fUSDC
	// the fee is x * 0.003009027 (99.7% input -> 100%)
	if token0IsFluid != amount0IsNeg {
		feeMultiplier = poolFee
	} else {
		poolFeeRem := new(big.Rat).Sub(big.NewRat(1, 1), poolFee)
		invPoolFee := new(big.Rat).Inv(poolFeeRem)
		feeMultiplier = new(big.Rat).Sub(invPoolFee, big.NewRat(1, 1))
	}

	fee := new(big.Rat).Set(fluidTransferAmount)
	fee = fee.Mul(fee, feeMultiplier)

	// adjust by decimals to get the price in USD
	decimalsAdjusted := math.Pow10(tokenDecimals)
	decimalsRat := new(big.Rat).SetFloat64(decimalsAdjusted)

	fee.Quo(fee, decimalsRat)
	fluidTransferAmount.Quo(fluidTransferAmount, decimalsRat)

	feeData.Fee = fee
	feeData.Volume = fluidTransferAmount

	return feeData, nil
}
