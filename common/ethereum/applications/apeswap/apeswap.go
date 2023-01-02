// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package apeswap

import (
	"fmt"
	"math"
	"math/big"

	ethAbi "github.com/ethereum/go-ethereum/accounts/abi"
	ethCommon "github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/ethclient"

	"github.com/fluidity-money/fluidity-app/common/ethereum"
	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/types/worker"
)

const apeswapLogTopic = "0xd78ad95fa46c994b6551d0da85fc275fe613ce37657fb8d5e3d130840159d822"

const apeswapPairAbiString = `[
  {
    "constant": true,
    "inputs": [],
    "name": "token0",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "token1",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "payable": false,
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
  }
]`

var apeswapPairAbi ethAbi.ABI

func GetApeswapFees(transfer worker.EthereumApplicationTransfer, client *ethclient.Client, fluidContractAddress ethCommon.Address, tokenDecimals int) (*big.Rat, error) {

	if len(transfer.Log.Topics) < 1 {
		return nil, fmt.Errorf("Not enough log topics passed!")
	}

	logTopic := transfer.Log.Topics[0].String()

	if logTopic != apeswapLogTopic {
		return nil, nil
	}
	// decode the amount of each token in the log
	unpacked, err := apeswapPairAbi.Unpack("Swap", transfer.Log.Data)

	if err != nil {
		return nil, fmt.Errorf(
			"Failed to unpack swap log data! %v",
			err,
		)
	}

	if len(unpacked) != 4 {
		return nil, fmt.Errorf(
			"Unpacked the wrong number of values! Expected 4, got %v",
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

	// get the pool ID from the log, so we can look up its contract
	// and fetch the swap fee percentage
	pairAddr_ := transfer.Log.Address.String()
	pairAddr := ethCommon.HexToAddress(pairAddr_)

	// now get the pair's token0
	token0_, err := ethereum.StaticCall(client, pairAddr, apeswapPairAbi, "token0")

	if err != nil {
		return nil, fmt.Errorf(
			"Failed to get token0! %v",
			err,
		)
	}

	token0, err := ethereum.CoerceBoundContractResultsToAddress(token0_)

	if err != nil {
		return nil, fmt.Errorf(
			"Failed to coerce token0 %v! %v",
			token0_,
			err,
		)
	}

	// now get the pair's token1
	token1_, err := ethereum.StaticCall(client, pairAddr, apeswapPairAbi, "token1")

	if err != nil {
		return nil, fmt.Errorf(
			"Failed to get token1! %v",
			err,
		)
	}

	token1, err := ethereum.CoerceBoundContractResultsToAddress(token1_)

	if err != nil {
		return nil, fmt.Errorf(
			"Failed to coerce token1 %v! %v",
			token1_,
			err,
		)
	}

	// `swapAmounts` are returned in their native token amounts (e.g. 45 USDC = 45000000)
	// so we need to adjust them to return a USD value
	decimalsAdjusted := math.Pow10(tokenDecimals)
	decimalsRat := new(big.Rat).SetFloat64(decimalsAdjusted)

	feePercent := big.NewRat(2,1000)

	var fluidTokens *big.Rat

		// get the amount of fluid tokens in this swap
	if token0 == fluidContractAddress {
		// amount0In | amount0Out

		if swapAmounts[0].Cmp(swapAmounts[2]) > 0 {
			fluidTokens = swapAmounts[0]
		} else {
			fluidTokens = swapAmounts[2]
		}

	} else if token1 == fluidContractAddress {
		// amount1In | amount1Out

		if swapAmounts[1].Cmp(swapAmounts[3]) > 0 {
			fluidTokens = swapAmounts[1]
		} else {
			fluidTokens = swapAmounts[3]
		}

	} else {
		// could be a multi-token pool swap that doesn't involve the fluid token
		log.App(func(k *log.Log) {
			k.Format(
				"Received an apeswap swap in transaction %#v not involving the fluid token - skipping!",
				transfer.TransactionHash.String(),
			)
		})

		return nil, nil
	}

	// multiply by fee percent
	feeAmount := new(big.Rat).Mul(fluidTokens, feePercent)

	// adjust for token decimals
	feeAmount.Quo(feeAmount, decimalsRat)

	return feeAmount, nil
}
