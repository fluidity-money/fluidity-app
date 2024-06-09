// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package pancakeswap

import (
	"fmt"
	"math"
	"math/big"

	"github.com/fluidity-money/fluidity-app/common/ethereum"
	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/types/applications"
	"github.com/fluidity-money/fluidity-app/lib/types/worker"

	ethAbi "github.com/ethereum/go-ethereum/accounts/abi"
	ethCommon "github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/ethclient"
)

const pancakeswapSwapLogTopic = "0x19b47279256b2a23a1665c810c8d55a1758940ee09377d4f8d26497a3577dc83"

const pancakeswapAbiString = `[
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
  },
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
      },
      {
        "indexed": false,
        "internalType": "uint128",
        "name": "protocolFeesToken0",
        "type": "uint128"
      },
      {
        "indexed": false,
        "internalType": "uint128",
        "name": "protocolFeesToken1",
        "type": "uint128"
      }
    ],
    "name": "Swap",
    "type": "event"
  }
]`

var zero = new(big.Int)

var pancakeswapAbi ethAbi.ABI

func GetPancackeswapFees(transfer worker.EthereumApplicationTransfer, client *ethclient.Client, fluidTokenContract ethCommon.Address, tokenDecimals int) (feeData applications.ApplicationFeeData, err error) {
	if len(transfer.Log.Topics) < 1 {
		return feeData, fmt.Errorf("not enough log topics passed!")
	}

	logTopic := transfer.Log.Topics[0].String()

	if logTopic != pancakeswapSwapLogTopic {
		return feeData, nil
	}

	unpacked, err := pancakeswapAbi.Unpack("Swap", transfer.Log.Data)

	if err != nil {
		return feeData, fmt.Errorf(
			"failed to unpack swap log data! %v",
			err,
		)
	}

	// there are 9 slots in this event, and 2 of them are indexed, so... 7
	if len(unpacked) != 7 {
		return feeData, fmt.Errorf(
			"unpacked the wrong number of values! Expected %v, got %v",
			7,
			len(unpacked),
		)
	}

	// convert the pair contract's address to the go ethereum address type
	contractAddr := ethereum.ConvertInternalAddress(transfer.Log.Address)

	// figure out which token is which in the pair contract
	token0addr_, err := ethereum.StaticCall(client, contractAddr, pancakeswapAbi, "token0")

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

	token1addr_, err := ethereum.StaticCall(client, contractAddr, pancakeswapAbi, "token1")

	if err != nil {
		return feeData, fmt.Errorf(
			"Failed to get token1 address! %v",
			err,
		)
	}

	token1addr, err := ethereum.CoerceBoundContractResultsToAddress(token1addr_)

	if err != nil {
		return feeData, fmt.Errorf(
			"failed to coerce token1 address! %v",
			err,
		)
	}

	swapContainsFluid := fluidTokenContract == token0addr || fluidTokenContract == token1addr

	amount0, ok := unpacked[1].(*big.Int)

	if !ok {
		return feeData, fmt.Errorf(
			"failed to coerce amountsIn! %v",
			err,
		)
	}

	amount1, ok := unpacked[2].(*big.Int)

	if !ok {
		return feeData, fmt.Errorf(
			"failed to coerce amountsOut! %v",
			err,
		)
	}

	var amountsIn, amountsOut *big.Int

	switch {
	//amount0 < 0
	case amount0.Cmp(zero) < 0:
		amountsIn = amount0
		amountsOut = amount1

	//amount1 < 0
	case amount1.Cmp(zero) < 0:
		amountsIn = amount1
		amountsOut = amount0

	// no value was exchanged!
	//amount0 == 0 && amount1 == 0
	case amount0.Cmp(zero) == 0 && amount1.Cmp(zero) == 0:
		amountsIn = amount0
		amountsOut = amount1

	default:
		return feeData, fmt.Errorf(
			"neither amount0 nor amount1 was negative, amount0 %v, amount1 %v",
			amount0,
			amount1,
		)
	}

	fluidTransferAmount := new(big.Rat)

	switch true {
	case !swapContainsFluid:
		log.App(func(k *log.Log) {
			k.Format(
				"Received a Pancakeswap swap in transaction %#v not involving the fluid token - skipping!",
				transfer.TransactionHash.String(),
			)
		})

		return feeData, nil

	// rather than determining which direction the swap was, look for the non-zero part of amountIn/amountOut
	case token0addr == fluidTokenContract:
		fluidTransferAmount.SetInt(amountsIn)

	case token1addr == fluidTokenContract:
		fluidTransferAmount.SetInt(amountsOut)
	}

	decimalsAdjusted := math.Pow10(tokenDecimals)
	decimalsRat := new(big.Rat).SetFloat64(decimalsAdjusted)

	fluidTransferAmount.Quo(fluidTransferAmount, decimalsRat)

	feeData.Fee = new(big.Rat).SetInt64(0) // TODO
	feeData.Volume = fluidTransferAmount

	return feeData, nil
}
