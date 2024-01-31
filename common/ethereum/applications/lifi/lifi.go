// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package lifi

import (
	"fmt"
	"math"
	"math/big"

	"github.com/fluidity-money/fluidity-app/common/ethereum"
	"github.com/fluidity-money/fluidity-app/lib/types/applications"
	"github.com/fluidity-money/fluidity-app/lib/types/worker"

	ethAbi "github.com/ethereum/go-ethereum/accounts/abi"
	ethCommon "github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/ethclient"
)

const lifiAbiString = `[
  {
    "type": "event",
    "name": "LiFiGenericSwapCompleted",
    "inputs": [
      {
        "name": "transactionId",
        "type": "bytes32",
        "indexed": true,
        "internalType": "bytes32"
      },
      {
        "name": "integrator",
        "type": "string",
        "indexed": false,
        "internalType": "string"
      },
      {
        "name": "referrer",
        "type": "string",
        "indexed": false,
        "internalType": "string"
      },
      {
        "name": "receiver",
        "type": "address",
        "indexed": false,
        "internalType": "address"
      },
      {
        "name": "fromAssetId",
        "type": "address",
        "indexed": false,
        "internalType": "address"
      },
      {
        "name": "toAssetId",
        "type": "address",
        "indexed": false,
        "internalType": "address"
      },
      {
        "name": "fromAmount",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "toAmount",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "LiFiSwappedGeneric",
    "inputs": [
      {
        "name": "transactionId",
        "type": "bytes32",
        "indexed": true,
        "internalType": "bytes32"
      },
      {
        "name": "integrator",
        "type": "string",
        "indexed": false,
        "internalType": "string"
      },
      {
        "name": "referrer",
        "type": "string",
        "indexed": false,
        "internalType": "string"
      },
      {
        "name": "fromAssetId",
        "type": "address",
        "indexed": false,
        "internalType": "address"
      },
      {
        "name": "toAssetId",
        "type": "address",
        "indexed": false,
        "internalType": "address"
      },
      {
        "name": "fromAmount",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "toAmount",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "AssetSwapped",
    "inputs": [
      {
        "name": "transactionId",
        "type": "bytes32",
        "indexed": false,
        "internalType": "bytes32"
      },
      {
        "name": "dex",
        "type": "address",
        "indexed": false,
        "internalType": "address"
      },
      {
        "name": "fromAssetId",
        "type": "address",
        "indexed": false,
        "internalType": "address"
      },
      {
        "name": "toAssetId",
        "type": "address",
        "indexed": false,
        "internalType": "address"
      },
      {
        "name": "fromAmount",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "toAmount",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "timestamp",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  }
]
`

var lifiAbi ethAbi.ABI

const (
	lifiGenericSwapCompletedTopic = "0x38eee76fd911eabac79da7af16053e809be0e12c8637f156e77e1af309b99537"
	lifiSwappedGenericTopic       = "0x93517b7c6f32856737008edf37cf2542b55d27d83fa299aa216f55a982a6ee1d"
	lifiAssetSwappedTopic         = "0x7bfdfdb5e3a3776976e53cb0607060f54c5312701c8cba1155cc4d5394440b38"
)

// genericSwapCompleted decodes "LiFiGenericSwapCompleted" and is
// determined by testing which side of the swap is a Fluid Asset, then
// setting the volume based on the volume for that side of the trade.
// Assumes 7 fields in the event decoding. Ie, if I swap 10 USDC for 9
// fUSDC, then the volume is 9.
func genericSwapCompleted(fluidTokenContract ethCommon.Address, tokenDecimals int, unpacked []interface{}) (feeData applications.ApplicationFeeData, err error) {
	if l := len(unpacked); l != 7 {
		return feeData, fmt.Errorf(
			"unpacked the wrong number of values for LiFiGenericSwapCompleted! Expected 8, got %v",
			l,
		)
	}

	// transaction id, the integrator, the referrer, and the receiver are ignored.
	// the receiver is the recipient of the end result of this swap.

	//transactionId := topics[1]

	//integrator := unpacked[0]
	//referrer := unpacked[1]
	//receiver := unpacked[2]

	fromAssetId, err := ethereum.CoerceBoundContractResultsToAddress(
		[]interface{}{unpacked[3]},
	)

	if err != nil {
		return feeData, fmt.Errorf(
			"failed to coerce fromAssetId to address: %v",
			err,
		)
	}

	toAssetId, err := ethereum.CoerceBoundContractResultsToAddress(
		[]interface{}{unpacked[4]},
	)

	if err != nil {
		return feeData, fmt.Errorf(
			"failed to coerce toAssetId to address: %v",
			err,
		)
	}

	fromAmount, err := ethereum.CoerceBoundContractResultsToRat(
		[]interface{}{unpacked[5]},
	)

	if err != nil {
		return feeData, fmt.Errorf(
			"failed to coerce fromAmount to *big.Rat: %v",
			err,
		)
	}

	toAmount, err := ethereum.CoerceBoundContractResultsToRat(
		[]interface{}{unpacked[6]},
	)

	if err != nil {
		return feeData, fmt.Errorf(
			"failed to coerce toAmount to *big.Rat: %v",
			err,
		)
	}

	fluidTransferAmount := new(big.Rat)

	switch fluidTokenContract {
	case fromAssetId:
		fluidTransferAmount.Set(fromAmount)

	case toAssetId:
		fluidTransferAmount.Set(toAmount)

	default:
		return feeData, fmt.Errorf(
			"failed to decode the volume: fluid contract address %v is not  asset id (%v) nor is to asset id (%v)",
			fluidTokenContract,
			fromAssetId,
			toAssetId,
		)
	}

	decimalsAdjusted := math.Pow10(tokenDecimals)
	decimalsRat := new(big.Rat).SetFloat64(decimalsAdjusted)

	feeData.Volume = new(big.Rat).Quo(fluidTransferAmount, decimalsRat)
	feeData.Fee = new(big.Rat).SetInt64(0)

	return feeData, nil
}

// swappedGeneric decodes LiFiSwappedGeneric, following largely the same
// behaviour as genericSwapCompleted. Expects 1 topic, and 6 unpacked items.
func swappedGeneric(fluidTokenContract ethCommon.Address, tokenDecimals int, unpacked []interface{}) (feeData applications.ApplicationFeeData, err error) {
	if l := len(unpacked); l != 6 {
		return feeData, fmt.Errorf(
			"unpacked the wrong number of values! Expected 6, got %v",
			l,
		)
	}

	// transaction id, the integrator, and the referrer are ignored.
	// follows the same code as genericSwapCompleted, though it
	// doesn't include the receiver.

	//transactionId := topic[1]

	//integrator := unpacked[0]
	//referrer := unpacked[1]

	fromAssetId, err := ethereum.CoerceBoundContractResultsToAddress(
		[]interface{}{unpacked[2]},
	)

	if err != nil {
		return feeData, fmt.Errorf(
			"failed to coerce fromAssetId to address: %v",
			err,
		)
	}

	toAssetId, err := ethereum.CoerceBoundContractResultsToAddress(
		[]interface{}{unpacked[3]},
	)

	if err != nil {
		return feeData, fmt.Errorf(
			"failed to coerce toAssetId to address: %v",
			err,
		)
	}

	fromAmount, err := ethereum.CoerceBoundContractResultsToRat(
		[]interface{}{unpacked[4]},
	)

	if err != nil {
		return feeData, fmt.Errorf(
			"failed to coerce fromAmount to *big.Rat: %v",
			err,
		)
	}

	toAmount, err := ethereum.CoerceBoundContractResultsToRat(
		[]interface{}{unpacked[5]},
	)

	if err != nil {
		return feeData, fmt.Errorf(
			"failed to coerce toAmount to *big.Rat: %v",
			err,
		)
	}

	fluidTransferAmount := new(big.Rat)

	switch fluidTokenContract {
	case fromAssetId:
		fluidTransferAmount.Set(fromAmount)

	case toAssetId:
		fluidTransferAmount.Set(toAmount)

	default:
		return feeData, fmt.Errorf(
			"failed to decode the volume for LiFiSwappedGeneric: fluid contract address %v is not  asset id (%v) nor is to asset id (%v)",
			fluidTokenContract,
			fromAssetId,
			toAssetId,
		)
	}

	decimalsAdjusted := math.Pow10(tokenDecimals)
	decimalsRat := new(big.Rat).SetFloat64(decimalsAdjusted)

	feeData.Volume = new(big.Rat).Quo(fluidTransferAmount, decimalsRat)
	feeData.Fee = new(big.Rat).SetInt64(0)

	return feeData, nil
}

// assetSwapped decodes events of AssetSwapped. Follows the same
// behaviour as it's predecessors.
func assetSwapped(fluidTokenContract ethCommon.Address, tokenDecimals int, unpacked []interface{}) (feeData applications.ApplicationFeeData, err error) {
	if l := len(unpacked); l != 7 {
		return feeData, fmt.Errorf(
			"unpacked the wrong number of values! Expected 7, got %v",
			l,
		)
	}

	// transaction id and the dex are ignored. finally, the timestamp
	// (final field) is ignored

	//transactionId := unpacked[0]
	//dex := unpacked[1]
	//timestamp := unpacked[6]

	fromAssetId, err := ethereum.CoerceBoundContractResultsToAddress(
		[]interface{}{unpacked[2]},
	)

	if err != nil {
		return feeData, fmt.Errorf(
			"failed to coerce fromAssetId to address: %v",
			err,
		)
	}

	toAssetId, err := ethereum.CoerceBoundContractResultsToAddress(
		[]interface{}{unpacked[3]},
	)

	if err != nil {
		return feeData, fmt.Errorf(
			"failed to coerce toAssetId to address: %v",
			err,
		)
	}

	fromAmount, err := ethereum.CoerceBoundContractResultsToRat(
		[]interface{}{unpacked[4]},
	)

	if err != nil {
		return feeData, fmt.Errorf(
			"failed to coerce fromAmount to *big.Rat: %v",
			err,
		)
	}

	toAmount, err := ethereum.CoerceBoundContractResultsToRat(
		[]interface{}{unpacked[5]},
	)

	if err != nil {
		return feeData, fmt.Errorf(
			"failed to coerce toAmount to *big.Rat: %v",
			err,
		)
	}

	//timestamp := unpacked[6]

	fluidTransferAmount := new(big.Rat)

	switch fluidTokenContract {
	case fromAssetId:
		fluidTransferAmount.Set(fromAmount)

	case toAssetId:
		fluidTransferAmount.Set(toAmount)

	default:
		return feeData, fmt.Errorf(
			"failed to decode the volume: fluid contract address %v is not  asset id (%v) nor is to asset id (%v)",
			fluidTokenContract,
			fromAssetId,
			toAssetId,
		)
	}

	decimalsAdjusted := math.Pow10(tokenDecimals)
	decimalsRat := new(big.Rat).SetFloat64(decimalsAdjusted)

	feeData.Volume = new(big.Rat).Quo(fluidTransferAmount, decimalsRat)
	feeData.Fee = new(big.Rat).SetInt64(0)

	return feeData, nil
}

// GetLifiFees unpacks several potential types of topics, and returns the
// volume. It does not determine the fees paid currently.
func GetLifiFees(transfer worker.EthereumApplicationTransfer, client *ethclient.Client, fluidTokenContract ethCommon.Address, tokenDecimals int) (feeData applications.ApplicationFeeData, err error) {
	transferLog := transfer.Log

	if len(transferLog.Topics) < 1 {
		return feeData, fmt.Errorf("not enough log topics passed!")
	}

	transferLogData := transfer.Log.Data

	logTopic := transferLog.Topics[0].String()

	// TODO: fees are not being tracked with Lifi

	switch logTopic {
	case lifiGenericSwapCompletedTopic:
		unpacked, err := lifiAbi.Unpack("LiFiGenericSwapCompleted", transferLogData)

		if err != nil {
			return feeData, fmt.Errorf(
				"failed to unpack a LiFiGenericSwapCompleted log: %v",
				err,
			)
		}

		return genericSwapCompleted(
			fluidTokenContract,
			tokenDecimals,
			unpacked,
		)

	case lifiSwappedGenericTopic:
		unpacked, err := lifiAbi.Unpack("LiFiSwappedGeneric", transferLogData)

		if err != nil {
			return feeData, fmt.Errorf(
				"failed to unpack a LiFiSwappedGeneric log: %v",
				err,
			)
		}

		return swappedGeneric(
			fluidTokenContract,
			tokenDecimals,
			unpacked,
		)

	case lifiAssetSwappedTopic:
		return feeData, fmt.Errorf(
			"unsupported feature decoding a AssetSwapped log",
		)


	default:
		return feeData, nil
	}
}
