// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package trader_joe

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

const (
	// Trader Joe fees are always e18
	FeeDecimals = 18
	traderJoeSwapLogTopic = "0xad7d6f97abf51ce18e17a38f4d70e975be9c0708474987bb3e26ad21bd93ca70"
)

const traderJoeLBPairAbiString = `[
  {
    "inputs": [],
    "name": "getTokenX",
    "outputs": [
      {
        "internalType": "contract IERC20",
        "name": "tokenX",
        "type": "address"
      }
    ],
    "stateMutability": "pure",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getTokenY",
    "outputs": [
      {
        "internalType": "contract IERC20",
        "name": "tokenY",
        "type": "address"
      }
    ],
    "stateMutability": "pure",
    "type": "function"
  }
]`

const traderJoeSwapAbiString = `[
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
        "name": "to",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint24",
        "name": "id",
        "type": "uint24"
      },
      {
        "indexed": false,
        "internalType": "bytes32",
        "name": "amountsIn",
        "type": "bytes32"
      },
      {
        "indexed": false,
        "internalType": "bytes32",
        "name": "amountsOut",
        "type": "bytes32"
      },
      {
        "indexed": false,
        "internalType": "uint24",
        "name": "volatilityAccumulator",
        "type": "uint24"
      },
      {
        "indexed": false,
        "internalType": "bytes32",
        "name": "totalFees",
        "type": "bytes32"
      },
      {
        "indexed": false,
        "internalType": "bytes32",
        "name": "protocolFees",
        "type": "bytes32"
      }
    ],
    "name": "Swap",
    "type": "event"
  }
]
`

var (
	traderJoeSwapAbi ethAbi.ABI
	traderJoeLBPairAbi ethAbi.ABI
)

// GetTraderJoeFees returns the volume and fees from a Trader Joe Swap event.
// The exact amounts of each are encoded as part of the log.
func GetTraderJoeFees(transfer worker.EthereumApplicationTransfer, client *ethclient.Client, fluidTokenContract ethCommon.Address, tokenDecimals int) (feeData applications.ApplicationFeeData, err error) {
	if len(transfer.Log.Topics) < 1 {
		return feeData, fmt.Errorf("not enough log topics passed!")
	}

	logTopic := transfer.Log.Topics[0].String()

	if logTopic != traderJoeSwapLogTopic {
		return feeData, nil
	}

	unpacked, err := traderJoeSwapAbi.Unpack("Swap", transfer.Log.Data)

	if err != nil {
		return feeData, fmt.Errorf(
			"failed to unpack swap log data! %v",
			err,
		)
	}

	// there are 9 slots in this event, and 3 of them are indexed, so... 6
	if len(unpacked) != 6 {
		return feeData, fmt.Errorf(
			"unpacked the wrong number of values! Expected %v, got %v",
			6,
			len(unpacked),
		)
	}

	// convert the pair contract's address to the go ethereum address type
	contractAddr := ethereum.ConvertInternalAddress(transfer.Log.Address)

	// figure out which token is which in the pair contract
	tokenXaddr_, err := ethereum.StaticCall(client, contractAddr, traderJoeLBPairAbi, "getTokenX")

	if err != nil {
		return feeData, fmt.Errorf(
			"Failed to get tokenX address! %v",
			err,
		)
	}

	tokenXaddr, err := ethereum.CoerceBoundContractResultsToAddress(tokenXaddr_)

	if err != nil {
		return feeData, fmt.Errorf(
			"Failed to coerce tokenX address! %v",
			err,
		)
	}

	tokenYaddr_, err := ethereum.StaticCall(client, contractAddr, traderJoeLBPairAbi, "getTokenY")

	if err != nil {
		return feeData, fmt.Errorf(
			"Failed to get tokenY address! %v",
			err,
		)
	}

	tokenYaddr, err := ethereum.CoerceBoundContractResultsToAddress(tokenYaddr_)

	if err != nil {
		return feeData, fmt.Errorf(
			"Failed to coerce tokenY address! %v",
			err,
		)
	}

	var (
		zero = big.NewInt(0)
		swapContainsFluid = fluidTokenContract == tokenXaddr || fluidTokenContract == tokenYaddr
	)

	fluidTransferAmount := new(big.Rat)

	// amountsIn is [32]{[0..15,16..31]} where the left side is token X and the right side is token Y
	amountsIn_ := unpacked[1]
	amountsIn, err := ethereum.CoerceBoundContractResultsToBytes32([]interface{}{amountsIn_})

	if err != nil {
		return feeData, fmt.Errorf(
			"Failed to coerce amountsIn to bytes32! %v",
			err,
		)
	}

	// amountsOut is [32]{[0..15,16..31]} where the left side is token X and the right side is token Y
	amountsOut_ := unpacked[2]
	amountsOut, err := ethereum.CoerceBoundContractResultsToBytes32([]interface{}{amountsOut_})

	if err != nil {
		return feeData, fmt.Errorf(
			"Failed to coerce amountsOut to bytes32! %v",
			err,
		)
	}

	switch true {
	case !swapContainsFluid:
		log.App(func(k *log.Log) {
			k.Format(
				"Received a Trader Joe swap in transaction %#v not involving the fluid token - skipping!",
				transfer.TransactionHash.String(),
			)
		})

		return feeData, nil

	// rather than determining which direction the swap was, look for the non-zero part of amountIn/amountOut
	case tokenXaddr == fluidTokenContract:
		// token X is the fluid token
		// amountIn for token X is the rightmost 16 bits
		amountInX := new(big.Int).SetBytes(amountsIn[16:])

		if amountInX.Cmp(zero) != 0 {
			// X was the in token, so set it as the transfer amount
			fluidTransferAmount.SetInt(amountInX)
			break
		} 

		// X was not the in token, so get the fluid volume from amountsOut
		amountOutX := new(big.Int).SetBytes(amountsOut[16:])
		fluidTransferAmount.SetInt(amountOutX)

	case tokenYaddr == fluidTokenContract:
		// token Y is the fluid token
		// amountIn for token Y is the leftmost 16 bits
		amountInY := new(big.Int).SetBytes(amountsIn[:16])

		if amountInY.Cmp(zero) != 0 {
			// Y was the in token, so set it as the transfer amount
			fluidTransferAmount.SetInt(amountInY)
			break
		} 

		// Y was not the in token, so get the fluid volume from amountsOut
		amountOutY := new(big.Int).SetBytes(amountsOut[:16])
		fluidTransferAmount.SetInt(amountOutY)
	}

	// we only consider the user-paid totalFees, not protocolFees
	totalFees_ := unpacked[4]
	totalFees, err := ethereum.CoerceBoundContractResultsToBytes32([]interface{}{totalFees_})

	if err != nil {
		return feeData, fmt.Errorf(
			"Failed to coerce totalFees to bytes32! %v",
			err,
		)
	}

	// the fee is stored in the first 16 bytes
	fee := new(big.Int).SetBytes(totalFees[:16])

	// the fee has its own decimals
	feeDecimalsAdjusted := math.Pow10(FeeDecimals)
	feeDecimalsRat := new(big.Rat).SetFloat64(feeDecimalsAdjusted)

	feeRat := new(big.Rat).SetInt(fee)
	feeRat.Quo(feeRat, feeDecimalsRat)

	decimalsAdjusted := math.Pow10(tokenDecimals)
	decimalsRat := new(big.Rat).SetFloat64(decimalsAdjusted)

	fluidTransferAmount.Quo(fluidTransferAmount, decimalsRat)

	feeData.Fee = feeRat
	feeData.Volume = fluidTransferAmount

	return feeData, nil
}
