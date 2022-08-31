// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package balancer

import (
	"fmt"
	"math"
	"math/big"

	ethAbi "github.com/ethereum/go-ethereum/accounts/abi"
	ethCommon "github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/ethclient"

	"github.com/fluidity-money/fluidity-app/common/ethereum"
	"github.com/fluidity-money/fluidity-app/lib/log"
	ethTypes "github.com/fluidity-money/fluidity-app/lib/types/ethereum"
	"github.com/fluidity-money/fluidity-app/lib/types/worker"
)

const balancerV2VaultAbiString = `[
	 {
	   "inputs": [
	     {
	       "internalType": "bytes32",
	       "name": "poolId",
	       "type": "bytes32"
	     }
	   ],
	   "name": "getPool",
	   "outputs": [
		 {
		   "internalType": "address",
	       "name": "",
	       "type": "address"
	      },
	      {
		    "internalType": "enum IVault.PoolSpecialization",
	        "name": "",
	        "type": "uint8"
	      }
	   ],
	   "stateMutability": "view",
	   "type": "function"
	}
]`

const balancerV2PoolAbiString = `[
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "bytes32",
          "name": "poolId",
          "type": "bytes32"
        },
        {
          "indexed": true,
          "internalType": "contract IERC20",
          "name": "tokenIn",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "contract IERC20",
          "name": "tokenOut",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amountIn",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amountOut",
          "type": "uint256"
        }
      ],
      "name": "Swap",
      "type": "event"
    },
	  {
	    "inputs": [],
	    "name": "getSwapFeePercentage",
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

// balancerV2VaultAbi set by init.go to generate the ABI code
var balancerV2VaultAbi ethAbi.ABI

// balancerV2PoolAbi set by init.go to generate the ABI code
var balancerV2PoolAbi ethAbi.ABI

// GetBalancerFees returns the fee for a balancer token swap, which is either static or
// dynamic, meaning we have to look up the value to ensure it hasn't changed. Returns
// the fee amount in USD using the same method as Uniswap - a direct calculation if the
// input token is the fluid token, or an approximation based on the swap percentage if the
// output token is the fluid token. This method generalises for Balancer's different pools
// (stable, weighted, etc.)
func GetBalancerFees(transfer worker.EthereumApplicationTransfer, client *ethclient.Client, fluidContractAddress ethCommon.Address, tokenDecimals int) (*big.Rat, error) {

	if len(transfer.Log.Topics) != 4 {
		return nil, fmt.Errorf(
			"Wrong number of log topics! Expected 4, got %v",
			len(transfer.Log.Topics),
		)
	}

	var (
		poolId    = transfer.Log.Topics[1]
		tokenIn_  = transfer.Log.Topics[2]
		tokenOut_ = transfer.Log.Topics[3]

		tokenIn  = ethCommon.HexToAddress(tokenIn_.String())
		tokenOut = ethCommon.HexToAddress(tokenOut_.String())
	)

	// decode the amount of each token in the log
	unpacked, err := balancerV2PoolAbi.Unpack("Swap", transfer.Log.Data)

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

	// get the pool ID from the log, so we can look up its contract
	// and fetch the swap fee percentage
	vaultAddr_ := transfer.Log.Address.String()
	vaultAddr := ethCommon.HexToAddress(vaultAddr_)

	// convert pool id to fixed-length byte array to make the contract call
	idBytes := hashTo32Bytes(poolId)

	// [address, type]
	pool_, err := ethereum.StaticCall(client, vaultAddr, balancerV2VaultAbi, "getPool", idBytes)

	if err != nil {
		return nil, fmt.Errorf(
			"Failed to fetch pool! %v",
			err,
		)
	}

	poolAddr_ := []interface{}{pool_[0]}

	poolAddr, err := ethereum.CoerceBoundContractResultsToAddress(poolAddr_)

	if err != nil {
		return nil, fmt.Errorf(
			"Failed to coerce pooladdr %v! %v",
			poolAddr_,
			err,
		)
	}

	// now look up the swap percentage from the pool
	swapPercentage, err := ethereum.StaticCall(client, poolAddr, balancerV2PoolAbi, "getSwapFeePercentage")

	if err != nil {
		return nil, fmt.Errorf(
			"Failed to get swapPercentage! %v",
			err,
		)
	}

	swapRat, err := ethereum.CoerceBoundContractResultsToRat(swapPercentage)

	if err != nil {
		return nil, fmt.Errorf(
			"Failed to coerce swapPercentage %v! %v",
			swapPercentage,
			err,
		)
	}

	// the contract always stores the fee with 18 decimals, so adjust it
	big10e18 := int64(1_000_000_000_000_000_000)

	swapDecimals := big.NewRat(big10e18, 1)
	swapRat.Quo(swapRat, swapDecimals)

	// `swapAmounts` are returned in their native token amounts (e.g. 45 USDC = 45000000)
	// so we need to adjust them to return a USD value
	decimalsAdjusted := math.Pow10(tokenDecimals)
	decimalsRat := new(big.Rat).SetFloat64(decimalsAdjusted)

	var (
		amountIn  = swapAmounts[0]
		amountOut = swapAmounts[1]
	)

	switch true {
	case tokenIn == fluidContractAddress:
		// get the exact value based on the inputted fluid tokens
		// fee = amountIn * swapPercentage / tokenDecimals
		amountIn = amountIn.Mul(amountIn, swapRat)
		amountIn = amountIn.Quo(amountIn, decimalsRat)
		return amountIn, nil

	case tokenOut == fluidContractAddress:
		// get the approximated value based on the received fluid tokens
		// fee ~= amountOut * (1 / (1 - swapPercentage)) - 1
		// estimated the same way as Uniswap, but with a generalised swap percentage

		// 1
		bigOne := big.NewRat(1, 1)

		// 1 - swapPercentage
		oneTakeSwap := new(big.Rat).Sub(bigOne, swapRat)

		// 1 / (1 - swapPercentage)
		reciprocal := new(big.Rat).Quo(bigOne, oneTakeSwap)

		// (1 / (1 - swapPercentage)) - 1
		outFeePercentage := new(big.Rat).Sub(reciprocal, bigOne)

		// approx. fee
		amountOut.Mul(amountOut, outFeePercentage)

		// adjust for token decimals
		amountOut.Quo(amountOut, decimalsRat)

		return amountOut, nil

	default:
		// could be a multi-token pool swap that doesn't involve the fluid token
		log.App(func(k *log.Log) {
			k.Format(
				"Received a balancer swap in transaction %#v not involving the fluid token - skipping!",
				transfer.Transaction.Hash.String(),
			)
		})

		return nil, nil
	}
}

// hashTo32Bytes to convert a hash to a 32 byte array
func hashTo32Bytes(hash ethTypes.Hash) [32]byte {
	var idBytes [32]byte

	p := ethCommon.FromHex(hash.String())
	for i, b := range p {
		// truncate if the hash is too long
		if i >= 32 {
			return idBytes
		}

		idBytes[i] = byte(b)
	}

	return idBytes
}
