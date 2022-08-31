// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package multichain

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

const multichainAbiString = `[
{
	"anonymous": false,
	"inputs": [
		{
			"indexed": true,
			"internalType": "bytes32",
			"name": "txhash",
			"type": "bytes32"
		},
		{
			"indexed": true,
			"internalType": "address",
			"name": "token",
			"type": "address"
		},
		{
			"indexed": true,
			"internalType": "address",
			"name": "to",
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
			"name": "fromChainID",
			"type": "uint256"
		},
		{
			"indexed": false,
			"internalType": "uint256",
			"name": "toChainID",
			"type": "uint256"
		}
	],
	"name": "LogAnySwap",
	"type": "event"
}]`

const anyswapERC20AbiString = `[
{
	"inputs": [],
	"name": "underlying",
	"outputs": [
		{
			"internalType": "address",
			"name": "",
			"type": "address"
		}
	],
	"stateMutability": "view",
	"type": "function"
}]`

var multichainAbi ethAbi.ABI
var anyswapERC20Abi ethAbi.ABI

// GetMultichainSwapFees calculates fees from Swapping anyTokenA between chains
// So far we only track outgoing swaps on each chain, to avoid double-rewarding, and so we properly
// track the receiving pool
// Fees are calculated as 0.1% for stablecoin swaps, clamped between $40 and $1000 USD
func GetMultichainAnySwapFees(transfer worker.EthereumApplicationTransfer, client *ethclient.Client, fluidTokenContract ethCommon.Address, tokenDecimals int) (*big.Rat, error) {
	unpacked, err := multichainAbi.Unpack("LogAnySwap", transfer.Log.Data)

	if err != nil {
		return nil, fmt.Errorf(
			"Failed to unpack LogAnySwap log data! %v",
			err,
		)
	}

	expectedUnpackedLen := 3
	if len(unpacked) != expectedUnpackedLen {
		return nil, fmt.Errorf(
			"Unpacked the wrong number of values! Expected %v, got %v",
			expectedUnpackedLen,
			len(unpacked),
		)
	}

	swapData, err := ethereum.CoerceBoundContractResultsToRats(unpacked)

	if err != nil {
		return nil, fmt.Errorf(
			"Failed to coerce swap data to rats! %v",
			err,
		)
	}

	var (
		// swap logs
		// amount is the amount of minted/sold
		amount = swapData[0]

		// log topics
		// anyToken address
		any_token = transfer.Log.Topics[1]
	)

	anyTokenAddress := ethCommon.HexToAddress(any_token.String())

	// Get address of src token
	swappedTokenAddress_, err := ethereum.StaticCall(client, anyTokenAddress, anyswapERC20Abi, "underlying")

	if err != nil {
		return nil, fmt.Errorf(
			"Failed to get swappedToken address! %v",
			err,
		)
	}

	swappedTokenAddress, err := ethereum.CoerceBoundContractResultsToAddress(swappedTokenAddress_)

	if err != nil {
		return nil, fmt.Errorf(
			"Failed to coerce %v to address! %v",
			swappedTokenAddress_,
			err,
		)
	}

	swapContainsFluid := swappedTokenAddress == fluidTokenContract

	if !swapContainsFluid {
		log.App(func(k *log.Log) {
			k.Format(
				"Received a multichain swap in transaction %#v not involving the fluid token - skipping!",
				transfer.Transaction.Hash.String(),
			)
		})

		return nil, nil
	}

	// adjust by decimals to get the price in USD
	decimalsAdjusted := math.Pow10(tokenDecimals)
	decimalsRat := new(big.Rat).SetFloat64(decimalsAdjusted)

	fluidFee := calculateMultichainAnySwapFee(
		amount,
		decimalsRat,
	)

	return fluidFee, nil
}

// calculateMulticoinSwapFee takes 0.1% per transaction of stable-coins, with a minimum fee of $40,
// and maximum fee of $1000. Given Fluid tokens are stable coins, we calculate 0.1% of amount, adjust
// for decimals, and clamp it between $40 and $1000
func calculateMultichainAnySwapFee(amount, decimalsRat *big.Rat) *big.Rat {
	// 0.1%
	feeRate := big.NewRat(1, 1000)

	// amount * 0.1%
	feeAmount := new(big.Rat).Mul(amount, feeRate)

	// $(amount * 0.1%) USD
	feeAmountUsd := new(big.Rat).Quo(feeAmount, decimalsRat)

	// $40
	minFee := big.NewRat(40, 1)

	// $1000
	maxFee := big.NewRat(1000, 1)

	switch true {
	// feeAmountUsd < minFee -> minFee
	case feeAmountUsd.Cmp(minFee) < 0:
		return minFee

	// feeAmountUsd > maxFee -> maxFee
	case feeAmountUsd.Cmp(maxFee) > 0:
		return maxFee

	// 40 <= fee <= 1000 -> fee
	default:
		return feeAmountUsd
	}
}
