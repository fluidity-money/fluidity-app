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

const (
	oneInchLPV2SwapLogTopic = "0xbd99c6719f088aa0abd9e7b7a4a635d1f931601e9f304b538dc42be25d8c65c6"
	oneInchLPV1SwapLogTopic = "0x2a368c7f33bb86e2d999940a3989d849031aff29b750f67947e6b8e8c3d2ffd6"
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
func GetOneInchLPFees(transfer worker.EthereumApplicationTransfer, client *ethclient.Client, fluidTokenContract ethCommon.Address, tokenDecimals int) (applications.ApplicationFeeData, error) {
	var feeData applications.ApplicationFeeData

	if len(transfer.Log.Topics) < 1 {
		return feeData, fmt.Errorf("No log topics passed")
	}

	logTopic := transfer.Log.Topics[0].String()

	// ignore v1 swaps
	if logTopic == oneInchLPV1SwapLogTopic {
		return feeData, nil
	}

	if logTopic != oneInchLPV2SwapLogTopic {
		return feeData, nil
	}

	if len(transfer.Log.Topics) != 4 {
		return feeData, fmt.Errorf(
			"topics contain the wrong number of values (Expected 4, got %v)! TxHash: %v",
			len(transfer.Log.Topics),
			transfer.TransactionHash,
		)
	}

	// decode the amount of each token in the log
	// doesn't contain addresses, as they're indexed
	unpacked, err := oneInchLiquidityPoolV2Abi.Unpack("Swapped", transfer.Log.Data)

	if err != nil {
		return feeData, fmt.Errorf(
			"failed to unpack swap log data! %v",
			err,
		)
	}

	if len(unpacked) != 6 {
		return feeData, fmt.Errorf(
			"unpacked the wrong number of values (Expected 6, got %v)! TxHash: %v",
			len(unpacked),
			transfer.TransactionHash,
		)
	}

	swapAmounts_ := unpacked[1:5]

	swapAmounts, err := ethereum.CoerceBoundContractResultsToRats(swapAmounts_)

	if err != nil {
		return feeData, fmt.Errorf(
			"Failed to coerce swap log data to rats! %v",
			err,
		)
	}

	// convert the pair contract's address to the go ethereum address type
	contractAddr_ := transfer.Log.Address
	contractAddr := ethereum.ConvertInternalAddress(contractAddr_)

	// figure out which token is which in the pair contract
	token0addr_ := transfer.Log.Topics[2]
	token0addr := ethCommon.HexToAddress(token0addr_.String())

	token1addr_ := transfer.Log.Topics[3]
	token1addr := ethCommon.HexToAddress(token1addr_.String())

	var (
		// swap logs
		// amount is the initial number of Token0
		amount = swapAmounts[0]
		// result is the resulting amount of Token1
		result = swapAmounts[1]
		// srcAdditionBalance is amount inside Token0 pool prior to swap
		srcAdditionBalance = swapAmounts[2]
		// dstRemovalBalance is amount inside Token1 pool prior to swap
		dstRemovalBalance = swapAmounts[3]

		// fluidFee is total amount of fluid tokens paid in fees
		fluidFee *big.Rat

		// whether the token being swapped from is the fluid token
		srcTokenIsFluid = token0addr == fluidTokenContract

		swapContainsFluid = srcTokenIsFluid || (token1addr == fluidTokenContract)
	)

	if !swapContainsFluid {
		log.App(func(k *log.Log) {
			k.Format(
				"Received a 1InchV2 swap in transaction %#v not involving the fluid token - skipping!",
				transfer.TransactionHash.String(),
			)
		})

		return feeData, nil
	}

	if srcTokenIsFluid {
		feeData.Volume = amount
	} else {
		feeData.Volume = result
	}

	staticFeeNum_, err := ethereum.StaticCall(client, contractAddr, oneInchLiquidityPoolV2Abi, "fee")

	if err != nil {
		return feeData, fmt.Errorf(
			"failed to call \"fee\" from contract %v! %v",
			contractAddr.String(),
			err,
		)
	}

	staticFeeNum, err := ethereum.CoerceBoundContractResultsToRat(staticFeeNum_)

	if err != nil {
		return feeData, fmt.Errorf(
			"failed to coerce fee to Rat! (%v) %v",
			staticFeeNum_,
			err,
		)
	}

	slippageFeeNum_, err := ethereum.StaticCall(client, contractAddr, oneInchLiquidityPoolV2Abi, "slippageFee")

	if err != nil {
		return feeData, fmt.Errorf(
			"failed to call \"slippageFee\" from contract %v! %v",
			contractAddr.String(),
			err,
		)
	}

	slippageFeeNum, err := ethereum.CoerceBoundContractResultsToRat(slippageFeeNum_)

	if err != nil {
		return feeData, fmt.Errorf(
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

	feeData.Fee = new(big.Rat).Set(fluidFee)
	feeData.Volume = feeData.Volume.Quo(feeData.Volume, decimalsRat)

	return feeData, nil
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
