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

const mooniswapSwapLogTopic = "0x86c49b5d8577da08444947f1427d23ef191cfabf2c0788f93324d79e926a9302"

const mooniswapPoolV1AbiString = `[
{
	"anonymous": false,
	"inputs": [
		{
			"indexed": true,
			"internalType": "address",
			"name": "account",
			"type": "address"
		},
		{
			"indexed": true,
			"internalType": "address",
			"name": "src",
			"type": "address"
		},
		{
			"indexed": true,
			"internalType": "address",
			"name": "dst",
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
			"name": "result",
			"type": "uint256"
		},
		{
			"indexed": false,
			"internalType": "uint256",
			"name": "srcBalance",
			"type": "uint256"
		},
		{
			"indexed": false,
			"internalType": "uint256",
			"name": "dstBalance",
			"type": "uint256"
		},
		{
			"indexed": false,
			"internalType": "uint256",
			"name": "totalSupply",
			"type": "uint256"
		},
		{
			"indexed": false,
			"internalType": "address",
			"name": "referral",
			"type": "address"
		}
	],
	"name": "Swapped",
	"type": "event"
}]`

var mooniswapPoolV1Abi ethAbi.ABI

// GetMooniswapFees returns Mooniswap's fee of 0.3% of the amount swapped.
// If the token swapped from was the fluid token, get the exact amount,
// otherwise approximate the cost based on the received amount of the fluid token
func GetMooniswapV1Fees(transfer worker.EthereumApplicationTransfer, client *ethclient.Client, fluidTokenContract ethCommon.Address, tokenDecimals int) (applications.ApplicationFeeData, error) {
	var feeData applications.ApplicationFeeData

	if len(transfer.Log.Topics) < 1 {
		return feeData, fmt.Errorf("No log topics passed")
	}

	logTopic := transfer.Log.Topics[0].String()

	if logTopic != mooniswapSwapLogTopic {
		return feeData, nil
	}

	// decode the amount of each token in the log
	// doesn't contain addresses, as they're indexed
	if topics := len(transfer.Log.Topics); topics != 4 {
		return feeData, fmt.Errorf(
			"unexpected mooniswap swap log topic length! Expected 4, got %v",
			topics,
		)
	}

	unpacked, err := mooniswapPoolV1Abi.Unpack("Swapped", transfer.Log.Data)

	if err != nil {
		return feeData, fmt.Errorf(
			"Failed to unpack swap log data! %v",
			err,
		)
	}

	if len(unpacked) != 6 {
		return feeData, fmt.Errorf(
			"Unpacked the wrong number of values! Expected 6, got %v",
			len(unpacked),
		)
	}

	// remove last "referrer" address field from logs
	swapAmounts_ := unpacked[:len(unpacked)-1]

	swapAmounts, err := ethereum.CoerceBoundContractResultsToRats(swapAmounts_)

	if err != nil {
		return feeData, fmt.Errorf(
			"Failed to coerce swap log data to rats! %v",
			err,
		)
	}

	token0addr_ := transfer.Log.Topics[2]

	token0addr := ethCommon.HexToAddress(token0addr_.String())

	token1addr_ := transfer.Log.Topics[3]

	token1addr := ethCommon.HexToAddress(token1addr_.String())

	var (
		// swap logs
		// amount is the amount of in tokens
		amount = swapAmounts[0]
		// result is the amount of out tokens
		result = swapAmounts[1]

		// the amount of fluid tokens sent or received
		fluidTransferAmount *big.Rat

		// the multiplier to find the fee
		feeMultiplier *big.Rat

		// whether the token being swapped from is the fluid token
		inTokenIsFluid = token0addr == fluidTokenContract

		txContainsFluid = inTokenIsFluid || (token1addr == fluidTokenContract)
	)

	if !txContainsFluid {
		log.App(func(k *log.Log) {
			k.Format(
				"Received a Mooniswap swap in transaction %#v not involving the fluid token - skipping!",
				transfer.TransactionHash.String(),
			)
		})

		return feeData, nil
	}

	// if trading x fUSDC -> y Token B
	// the fee is x * 0.003 (100% input -> 99.7%)
	// if trading y Token B -> x fUSDC
	// the fee is x * 0.003009027 (99.7% input -> 100%)
	if inTokenIsFluid {
		feeMultiplier = big.NewRat(3, 1000)
		fluidTransferAmount = amount
	} else {
		feeMultiplier = big.NewRat(3, 997)
		fluidTransferAmount = result
	}

	feeData.Volume = new(big.Rat).Set(fluidTransferAmount)

	fee := new(big.Rat).Mul(fluidTransferAmount, feeMultiplier)

	// adjust by decimals to get the price in USD
	decimalsAdjusted := math.Pow10(tokenDecimals)
	decimalsRat := new(big.Rat).SetFloat64(decimalsAdjusted)

	fee.Quo(fee, decimalsRat)
	feeData.Volume = feeData.Volume.Quo(feeData.Volume, decimalsRat)

	feeData.Fee = fee

	return feeData, nil
}
