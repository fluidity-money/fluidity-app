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
	"github.com/fluidity-money/fluidity-app/lib/types/worker"
)

const oneInchLiquidityPoolV2AbiString = `[
{
	"inputs": [],
	"name": "fee",
	"outputs": [
		{
			"internalType": "uint256",
			"name": "",
			"type": "uint256"
		}
	],
	"stateMutability": "view",
	"type": "function"
},
{
	"inputs": [],
	"name": "slippageFee",
	"outputs": [
		{
			"internalType": "uint256",
			"name": "",
			"type": "uint256"
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
			"name": "receiver",
			"type": "address"
		},
		{
			"indexed": true,
			"internalType": "address",
			"name": "srcToken",
			"type": "address"
		},
		{
			"indexed": false,
			"internalType": "address",
			"name": "dstToken",
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
			"name": "srcAdditionBalance",
			"type": "uint256"
		},
		{
			"indexed": false,
			"internalType": "uint256",
			"name": "dstRemovalBalance",
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

// FeeDecimals is the hardcoded denominator used by 1inchLP to derive fees
const FeeDecimals = 18

var oneInchLiquidityPoolV2Abi ethAbi.ABI

// GetOneInchLPFees implements 1InchLPv1.0/1.1 fee structure.
// Fees are split into static fees and slippage fees, controlled by 1Inch governance
func GetOneInchLPFees(transfer worker.EthereumApplicationTransfer, client *ethclient.Client, fluidTokenContract ethCommon.Address, tokenDecimals int) (*big.Rat, error) {

	if len(transfer.Log.Topics) != 4 {
		return nil, fmt.Errorf(
			"topics contain the wrong number of values (Expected 4, got %v)! TxHash: %v",
			len(transfer.Log.Topics),
			transfer.Transaction.Hash,
		)
	}

	// decode the amount of each token in the log
	// doesn't contain addresses, as they're indexed
	unpacked, err := oneInchLiquidityPoolV2Abi.Unpack("Swapped", transfer.Log.Data)

	if err != nil {
		return nil, fmt.Errorf(
			"failed to unpack swap log data! %v",
			err,
		)
	}

	if len(unpacked) != 6 {
		return nil, fmt.Errorf(
			"unpacked the wrong number of values (Expected 6, got %v)! TxHash: %v",
			len(unpacked),
			transfer.Transaction.Hash,
		)
	}

	swapAmounts_ := unpacked[1:5]

	swapAmounts, err := ethereum.CoerceBoundContractResultsToRats(swapAmounts_)

	if err != nil {
		return nil, fmt.Errorf(
			"Failed to coerce swap log data to rats! %v",
			err,
		)
	}

	// convert the pair contract's address to the go ethereum address type
	contractAddr_ := transfer.Log.Address
	contractAddr := ethCommon.HexToAddress(contractAddr_.String())

	// figure out which token is which in the pair contract
	token0addr_ := transfer.Log.Topics[3]
	token0addr := ethCommon.HexToAddress(token0addr_.String())

	var (
		// swap logs
		// amount is the initial number of Token0
		amount = swapAmounts[0]
		// srcAdditionBalance is amount inside Token0 pool prior to swap
		srcAdditionBalance = swapAmounts[2]
		// dstRemovalBalance is amount inside Token1 pool prior to swap
		dstRemovalBalance = swapAmounts[3]

		// fluidFee is total amount of fluid tokens paid in fees
		fluidFee *big.Rat

		// whether the token being swapped from is the fluid token
		srcTokenIsFluid = token0addr == fluidTokenContract
	)

	staticFeeNum_, err := ethereum.StaticCall(client, contractAddr, oneInchLiquidityPoolV2Abi, "fee")

	if err != nil {
		return nil, fmt.Errorf(
			"failed to call \"fee\" from contract %v! %v",
			contractAddr.String(),
			err,
		)
	}

	staticFeeNum, err := ethereum.CoerceBoundContractResultsToRat(staticFeeNum_)

	if err != nil {
		return nil, fmt.Errorf(
			"failed to coerce fee to Rat! (%v) %v",
			staticFeeNum_,
			err,
		)
	}

	slippageFeeNum_, err := ethereum.StaticCall(client, contractAddr, oneInchLiquidityPoolV2Abi, "slippageFee")

	if err != nil {
		return nil, fmt.Errorf(
			"failed to call \"slippageFee\" from contract %v! %v",
			contractAddr.String(),
			err,
		)
	}

	slippageFeeNum, err := ethereum.CoerceBoundContractResultsToRat(slippageFeeNum_)

	if err != nil {
		return nil, fmt.Errorf(
			"failed to coerce slippageFee to Rat! (%v) %v",
			slippageFeeNum_,
			err,
		)
	}

	fluidFee = calculateTotalFluidFee(amount, staticFeeNum, slippageFeeNum, srcAdditionBalance, dstRemovalBalance, srcTokenIsFluid, FeeDecimals)

	// adjust by decimals to get the price in USD
	decimalsAdjusted := math.Pow10(tokenDecimals)
	decimalsRat := new(big.Rat).SetFloat64(decimalsAdjusted)

	fluidFee.Quo(fluidFee, decimalsRat)

	return fluidFee, nil
}

func calculateStaticFee(amount, staticFeeRate *big.Rat) *big.Rat {
	staticFee := new(big.Rat).Mul(amount, staticFeeRate)

	return staticFee
}

// implementation of LPv1.1 fee calculation
// fees are based on Token A amount, and should be converted if Token A is not a fluid token
func calculateSlippageFee(amount, slippageFeeRate, poolBalance *big.Rat) *big.Rat {
	poolSlippage := new(big.Rat).Quo(amount, poolBalance)

	slippageFee := new(big.Rat).Mul(slippageFeeRate, poolSlippage)

	slippageFee = slippageFee.Mul(amount, slippageFee)

	return slippageFee
}

func calculateTotalFluidFee(amount, staticFeeNum, slippageFeeNum, srcBalance, dstBalance *big.Rat, amountIsFluid bool, feeDecimals int) *big.Rat {
	feeDecimalsRat := new(big.Rat).SetFloat64(math.Pow10(feeDecimals))

	staticFeeRate := new(big.Rat).Quo(staticFeeNum, feeDecimalsRat)

	srcStaticFee := calculateStaticFee(amount, staticFeeRate)

	remainingSrcTransferAmount := new(big.Rat).Sub(amount, srcStaticFee)

	newSrcPoolBalance := new(big.Rat).Add(srcBalance, remainingSrcTransferAmount)

	slippageFeeRate := new(big.Rat).Quo(slippageFeeNum, feeDecimalsRat)

	srcSlippageFee := calculateSlippageFee(remainingSrcTransferAmount, slippageFeeRate, newSrcPoolBalance)

	srcTotalFee := new(big.Rat).Add(srcStaticFee, srcSlippageFee)

	// if trading (x + fee) fUSDC -> y Token B, return fUSDC fee
	if amountIsFluid {
		return srcTotalFee
	}

	// else trading (x + fee) Token A -> y fUSDC, return (fUSDC / Token A) fee) Token A
	srcToDstRate := new(big.Rat).Quo(dstBalance, newSrcPoolBalance)
	fluidFee := new(big.Rat).Mul(srcTotalFee, srcToDstRate)

	return fluidFee
}
