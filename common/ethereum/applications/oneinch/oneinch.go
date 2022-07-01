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

const oneInchAggregationV4AbiString = `[
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
			"internalType": "contract IERC20",
			"name": "srcToken",
			"type": "address"
		},
		{
			"indexed": true,
			"internalType": "contract IERC20",
			"name": "dstToken",
			"type": "address"
		},
		{
			"indexed": false,
			"internalType": "address",
			"name": "dstReceiver",
			"type": "address"
		},
		{
			"indexed": false,
			"internalType": "uint256",
			"name": "amount",
			"type": "uint256"
		},
		{
			"indexed": false,
			"internalType": "uint256",
			"name": "spentAmount",
			"type": "uint256"
		},
		{
			"indexed": false,
			"internalType": "uint256",
			"name": "returnAmount",
			"type": "uint256"
		},
		{
			"indexed": false,
			"internalType": "uint256",
			"name": "minReturnAmount",
			"type": "uint256"
		},
		{
			"indexed": false,
			"internalType": "uint256",
			"name": "guaranteedAmount",
			"type": "uint256"
		},
		{
			"indexed": false,
			"internalType": "address",
			"name": "referrer",
			"type": "address"
		}
	],
	"name": "Swapped",
	"type": "event"
}]`

// oneInchExchangeAbi set by init.go to generate the ABI code
var oneInchExchangeAbi ethAbi.ABI

// GetUniswapFees returns Uniswap V2's fee of 0.3% of the amount swapped.
// If the token swapped from was the fluid token, get the exact amount,
// otherwise approximate the cost based on the received amount of the fluid token
func GetOneInchFees(transfer worker.EthereumApplicationTransfer, client *ethclient.Client, fluidTokenContract ethCommon.Address, tokenDecimals int) (*big.Rat, error) {
	// decode the amount of each token in the log
	// doesn't contain addresses, as they're indexed
	unpacked, err := oneInchExchangeAbi.Unpack("Swapped", transfer.Log.Data)

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

	// convert the pair contract's address to the go ethereum address type
	contractAddr := ethCommon.HexToAddress(transfer.Log.Address.String())

	// figure out which token is which in the pair contract
	token0addr_, err := ethereum.StaticCall(client, contractAddr, oneInchExchangeAbi, "token0Exchange")

	if err != nil {
		return nil, fmt.Errorf(
			"Failed to get token0 address! %v",
			err,
		)
	}

	token0addr, err := ethereum.CoerceBoundContractResultsToAddress(token0addr_)

	if err != nil {
		return nil, fmt.Errorf(
			"Failed to coerce token0 address! %v",
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
		zeroRat        = big.NewRat(0, 1)
	)

	// fluid index 0  0, x, y, 0 = swapping x token for y fluid
	// fluid index 0  x, 0, 0, y = swapping x fluid for y token
	// fluid index 1  0, x, y, 0 = swapping x fluid for y token
	// fluid index 1  x, 0, 0, y = swapping x token for y fluid

	var (
		// Whether token0 is the fluid token
		fluidIndex0 = token0addr == fluidTokenContract
		// Whether amount0 is equal to zero
		amount0IsZero = amount0in.Cmp(zeroRat) == 0
	)

	switch true {
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

	// if trading x fUSDC -> y Token B
	// the fee is x * 0.003 (100% input -> 99.7%)
	// if trading y Token B -> x fUSDC
	// the fee is x * 0.003009027 (99.7% input -> 100%)
	if inTokenIsFluid {
		feeMultiplier = big.NewRat(3, 1000)
	} else {
		feeMultiplier = big.NewRat(3008027, 1000000000)
	}

	fee := new(big.Rat).Mul(fluidTransferAmount, feeMultiplier)

	// adjust by decimals to get the price in USD
	decimalsAdjusted := math.Pow10(tokenDecimals)
	decimalsRat := new(big.Rat).SetFloat64(decimalsAdjusted)

	fee.Quo(fee, decimalsRat)

	return fee, nil
}
