// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package sushiswap

import (
	"fmt"
	"math"
	"math/big"

	ethAbi "github.com/ethereum/go-ethereum/accounts/abi"
	ethCommon "github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/ethclient"
	"github.com/fluidity-money/fluidity-app/common/ethereum"
	"github.com/fluidity-money/fluidity-app/common/ethereum/applications/uniswap"
	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/types/applications"
	"github.com/fluidity-money/fluidity-app/lib/types/worker"
)

const sushiswapStablePoolAbiString = `[
	{
		"anonymous":false,
		"inputs":[
			{"indexed":true,"internalType":"address","name":"recipient","type":"address"},
			{"indexed":true,"internalType":"address","name":"tokenIn","type":"address"},
			{"indexed":true,"internalType":"address","name":"tokenOut","type":"address"},
			{"indexed":false,"internalType":"uint256","name":"amountIn","type":"uint256"},
			{"indexed":false,"internalType":"uint256","name":"amountOut","type":"uint256"}
		],
		"name":"Swap","type":"event"
	},
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
    "name": "decimals0",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
	"constant": true,
    "inputs": [],
    "name": "decimals1",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
	  "inputs":[],
	  "name":"swapFee",
	  "outputs":[
		  {
			  "internalType":"uint256",
			  "name":"",
			  "type":"uint256"
		  }
	  ],
	  "stateMutability":"view",
	  "type":"function"
  }
]`

const sushiswapConstantProductPoolAbiString = `[
	{
		"anonymous":false,
		"inputs":[
			{"indexed":true,"internalType":"address","name":"recipient","type":"address"},
			{"indexed":true,"internalType":"address","name":"tokenIn","type":"address"},
			{"indexed":true,"internalType":"address","name":"tokenOut","type":"address"},
			{"indexed":false,"internalType":"uint256","name":"amountIn","type":"uint256"},
			{"indexed":false,"internalType":"uint256","name":"amountOut","type":"uint256"}
		],
		"name":"Swap","type":"event"
	},
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
    "name": "decimals",
    "outputs": [
      {
        "internalType": "uint8",
        "name": "",
        "type": "uint8"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
	  "inputs":[],
	  "name":"swapFee",
	  "outputs":[
		  {
			  "internalType":"uint256",
			  "name":"",
			  "type":"uint256"
		  }
	  ],
	  "stateMutability":"view",
	  "type":"function"
  }
]`

var (
	// sushiswapStablePoolAbi set by init.go to generate the ABI code
	sushiswapStablePoolAbi ethAbi.ABI

	// sushiswapConstantProductPoolAbi set by init.go to generate the ABI code
	sushiswapConstantProductPoolAbi ethAbi.ABI
)

const sushiswapLogTopic = "0xcd3829a3813dc3cdd188fd3d01dcf3268c16be2fdd2dd21d0665418816e46062"

// GetSushiswapFees returns the fee paid on a Sushiswap transfer, either using a UniswapV2-style pair or a Trident StablePool
func GetSushiswapFees(transfer worker.EthereumApplicationTransfer, client *ethclient.Client, fluidTokenContract ethCommon.Address, tokenDecimals int) (applications.ApplicationFeeData, error) {
	var feeData applications.ApplicationFeeData

	if len(transfer.Log.Topics) < 1 {
		return feeData, fmt.Errorf("No log topics passed!")
	}

	logTopic := transfer.Log.Topics[0].String()

	switch logTopic {
	case uniswap.UniswapV2SwapLogTopic:
		return uniswap.GetUniswapV2Fees(transfer, client, fluidTokenContract, tokenDecimals)
	case sushiswapLogTopic:
		return GetSushiswapStableOrConstantProductFees(transfer, client, fluidTokenContract, tokenDecimals, feeData, logTopic)
	default:
		return feeData, nil
	}
}

// GetSushiswapStableOrConstantProductFees to determine the fee paid for a Sushiswap Trident Stable Swap or a Constant Product Swap. Both are identical except for the use of decimals0/decimals1 for Stable Swaps vs decimals for Constant Product Swaps
func GetSushiswapStableOrConstantProductFees(transfer worker.EthereumApplicationTransfer, client *ethclient.Client, fluidTokenContract ethCommon.Address, tokenDecimals int, feeData applications.ApplicationFeeData, logTopic string) (applications.ApplicationFeeData, error) {

	if logTopic != sushiswapLogTopic {
		return feeData, nil
	}

	if len(transfer.Log.Topics) != 4 {
		return feeData, fmt.Errorf(
			"Found the wrong number of logs! Expected 4, got %v",
			len(transfer.Log.Topics),
		)
	}

	unpacked, err := sushiswapStablePoolAbi.Unpack("Swap", transfer.Log.Data)

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

	// convert the pair contract's address to the go ethereum address type
	contractAddr := ethereum.ConvertInternalAddress(transfer.Log.Address)

	// fetch the swap fee
	swapFee_, err := ethereum.StaticCall(client, contractAddr, sushiswapStablePoolAbi, "swapFee")

	if err != nil {
		return feeData, fmt.Errorf(
			"Failed to fetch Sushiswap swap fee! %v",
			err,
		)
	}

	swapFee, err := ethereum.CoerceBoundContractResultsToRat(swapFee_)

	if err != nil {
		return feeData, fmt.Errorf(
			"Failed to coerce swap fee! %v",
			err,
		)
	}

	var (
		tokenIn  = transfer.Log.Topics[2]
		tokenOut = transfer.Log.Topics[3]

		amountIn = swapAmounts[0]

		// per https://github.com/sushiswap/trident/blob/b4f1e3bdaa8ebfbb8881c9794b03cb439879171c/contracts/pool/stable/StablePool.sol#L37
		// swapFee is in 100ths of a %, so 10000 represents a 100% fee
		maxFee = big.NewRat(10000, 1)
	)

	var (
		amountInDecimals *big.Rat

		tokenInAddress  = ethCommon.HexToAddress(tokenIn.String())
		tokenOutAddress = ethCommon.HexToAddress(tokenOut.String())
	)

	// set amountInDecimals to the decimals for the input token
	switch true {
	case tokenInAddress == fluidTokenContract:
		decimalsAdjusted := math.Pow10(tokenDecimals)
		decimalsRat := new(big.Rat).SetFloat64(decimalsAdjusted)
		amountInDecimals = decimalsRat

	case tokenOutAddress == fluidTokenContract:
		// amountIn is not fluid, look up correct decimals for amountIn
		// figure out which token is which in the pool contract
		token0addr_, err := ethereum.StaticCall(client, contractAddr, sushiswapStablePoolAbi, "token0")

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

		var (
			decimals_ []interface{}
			decimals  *big.Rat
		)

		// try Stable then ConstantProduct
		if fluidTokenContract == token0addr {
			decimals_, err = ethereum.StaticCall(client, contractAddr, sushiswapStablePoolAbi, "decimals1")
		} else {
			decimals_, err = ethereum.StaticCall(client, contractAddr, sushiswapStablePoolAbi, "decimals0")
		}

		if err != nil {
			// try ConstantProduct
			decimals_, err = ethereum.StaticCall(client, contractAddr, sushiswapConstantProductPoolAbi, "decimals")

			if err != nil {
				return feeData, fmt.Errorf(
					"Failed to fetch decimals for non-fluid token in pair using ConstantProduct ABI! %v",
					err,
				)
			}

			decimalsUint8, err := ethereum.CoerceBoundContractResultsToUint8(decimals_)

			if err != nil {
				return feeData, fmt.Errorf(
					"Failed to coerce decimals to uint8 %#v!",
					decimals_,
				)
			}

			// set `decimals` using the uint8 result from ConstantProduct
			decimalsAdjusted := math.Pow10(int(decimalsUint8))
			decimals = new(big.Rat).SetFloat64(decimalsAdjusted)
		} else {
			// set `decimals` using the uint256 result from Stable
			decimals, err = ethereum.CoerceBoundContractResultsToRat(decimals_)

			if err != nil {
				return feeData, fmt.Errorf(
					"Failed to coerce token decimals to rat! %v",
					err,
				)
			}
		}

		amountInDecimals = decimals

	default:
		log.App(func(k *log.Log) {
			k.Format(
				"Received a Sushiswap stable swap in transaction %#v not involving the fluid token - skipping!",
				transfer.TransactionHash.String(),
			)
		})

		return feeData, nil

	}

	feeData.Volume = new(big.Rat).Set(amountIn)
	feeData.Volume.Quo(feeData.Volume, amountInDecimals)

	// amountIn * swapFee / maxFee / 10 ^ decimals
	amountIn.Mul(amountIn, swapFee)
	amountIn.Quo(amountIn, maxFee)

	amountIn.Quo(amountIn, amountInDecimals)
	feeData.Fee = amountIn

	return feeData, nil

}
