// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package curve

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

const curveAbiString = `[
{
	"name": "TokenExchange",
	"inputs": [
		{
			"type": "address",
			"name": "buyer",
			"indexed": true
		},
		{
			"type": "int128",
			"name": "sold_id",
			"indexed": false
		},
		{
			"type": "uint256",
			"name": "tokens_sold",
			"indexed": false
		},
		{
			"type": "int128",
			"name": "bought_id",
			"indexed": false
		},
		{
			"type": "uint256",
			"name": "tokens_bought",
			"indexed": false
		}
	],
	"anonymous": false,
	"type": "event"
},
{
	"name": "coins",
	"outputs": [
		{
			"type": "address",
			"name": ""
		}
	],
	"inputs": [
		{
			"type": "uint256",
			"name": "arg0"
		}
	],
	"stateMutability": "view",
	"type": "function",
	"gas": 2220
},
{
	"name": "fee",
	"outputs": [
		{
			"type": "uint256",
			"name": ""
		}
	],
	"inputs": [],
	"stateMutability": "view",
	"type": "function",
	"gas": 2171
}]`

const curveFeeDecimals = 10

var curveAbi ethAbi.ABI

// GetCurveSwapFees calculates fees from Swapping TokenA and TokenB performed by a pool's exchange()
// All tokens in a pool are stable relative to each other, so slippage and token exchange rates are negligible
func GetCurveSwapFees(transfer worker.EthereumApplicationTransfer, client *ethclient.Client, fluidTokenContract ethCommon.Address, tokenDecimals int) (*big.Rat, error) {
	unpacked, err := curveAbi.Unpack("TokenExchange", transfer.Log.Data)

	if err != nil {
		return nil, fmt.Errorf(
			"Failed to unpack TokenExchange log data! %v",
			err,
		)
	}

	expectedUnpackedLen := 4
	if len(unpacked) != expectedUnpackedLen {
		return nil, fmt.Errorf(
			"Unpacked the wrong number of values! Expected %v, got %v",
			expectedUnpackedLen,
			len(unpacked),
		)
	}

	tokenExchangeData, err := ethereum.CoerceBoundContractResultsToRats(unpacked)

	if err != nil {
		return nil, fmt.Errorf(
			"Failed to coerce swap log data to rats! %v",
			err,
		)
	}

	var (
		// swap logs
		// sold_id is the ID (argument of coins) of tokenA
		sold_id = tokenExchangeData[0]
		// tokens_sold is the amount of sold_id transferred
		tokens_sold = tokenExchangeData[1]
		// bought_id is the ID (argument of coins) of tokenA
		bought_id = tokenExchangeData[2]
		// tokens_sold is the amount of sold_id transferred
		tokens_bought = tokenExchangeData[3]
	)

	contractAddress_ := transfer.Log.Address.String()
	contractAddress := ethCommon.HexToAddress(contractAddress_)

	// Get address of src token
	soldCoinAddress_, err := ethereum.StaticCall(client, contractAddress, curveAbi, "coins", sold_id.Num())

	if err != nil {
		return nil, fmt.Errorf(
			"Failed to get sold coins address! %v",
			err,
		)
	}

	soldCoinAddress, err := ethereum.CoerceBoundContractResultsToAddress(soldCoinAddress_)

	if err != nil {
		return nil, fmt.Errorf(
			"Failed to coerce %v to address! %v",
			soldCoinAddress_,
			err,
		)
	}

	soldTokenIsFluid := soldCoinAddress == fluidTokenContract

	// Get address of dst token
	boughtCoinAddress_, err := ethereum.StaticCall(client, contractAddress, curveAbi, "coins", bought_id.Num())

	if err != nil {
		return nil, fmt.Errorf(
			"Failed to get bought coin address! %v",
			err,
		)
	}

	boughtCoinAddress, err := ethereum.CoerceBoundContractResultsToAddress(boughtCoinAddress_)

	if err != nil {
		return nil, fmt.Errorf(
			"Failed to coerce %v to address! %v",
			boughtCoinAddress_,
			err,
		)
	}

	swapContainsFluid := soldTokenIsFluid || (boughtCoinAddress == fluidTokenContract)

	// TokenExchange does not contain Fluid Transfer
	if !swapContainsFluid {
		log.App(func(k *log.Log) {
			k.Format(
				"Received a Curve swap in transaction %#v not involving the fluid token - skipping!",
				transfer.Transaction.Hash.String(),
			)
		})

		return nil, nil
	}

	// Get current fee rate
	curveFeeNum_, err := ethereum.StaticCall(
		client,
		contractAddress,
		curveAbi,
		"fee",
	)

	if err != nil {
		return nil, fmt.Errorf(
			"Failed to retrieve fees! %v",
			err,
		)
	}

	curveFeeNum, err := ethereum.CoerceBoundContractResultsToRat(curveFeeNum_)

	if err != nil {
		return nil, fmt.Errorf(
			"Failed to coerce %v to rat! %v",
			curveFeeNum_,
			err,
		)
	}

	// adjust fee rate by curve's hardcoded fee decimals
	feeDecimalsAdjusted := math.Pow10(curveFeeDecimals)
	decimalsRat := new(big.Rat).SetFloat64(feeDecimalsAdjusted)

	curveFeeRate := new(big.Rat).Quo(curveFeeNum, decimalsRat)

	fluidFee := calculateCurveSwapFee(
		tokens_sold,
		tokens_bought,
		curveFeeRate,
		soldTokenIsFluid,
	)

	// adjust by decimals to get the price in USD
	decimalsAdjusted := math.Pow10(tokenDecimals)
	decimalsRat = new(big.Rat).SetFloat64(decimalsAdjusted)

	fluidFee.Quo(fluidFee, decimalsRat)

	return fluidFee, nil
}

// calculateCurveSwapFee returns the fee derived either from soldAmount * feeRate
// or boughtAmount * ((1 / (1 - feeRate)) - 1)
func calculateCurveSwapFee(soldAmount, boughtAmount, feeRate *big.Rat, soldTokenIsFluid bool) *big.Rat {
	if soldTokenIsFluid {
		// soldAmount * feeRate
		soldFee := new(big.Rat).Mul(soldAmount, feeRate)

		return soldFee
	}

	// 1
	bigOne := big.NewRat(1, 1)

	// (1 - feeRate)
	remainingFeeRate := new(big.Rat).Sub(bigOne, feeRate)

	// (1 / (1 - feeRate))
	reciprocalFeeRate := new(big.Rat).Quo(bigOne, remainingFeeRate)

	// ((1 / (1 - feeRate)) - 1)
	boughtFeeRate := new(big.Rat).Sub(reciprocalFeeRate, bigOne)

	// boughtAmount * ((1 / (1 - feeRate)) - 1)
	boughtFee := new(big.Rat).Mul(boughtAmount, boughtFeeRate)

	return boughtFee
}
