// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package paraswap

import (
	"fmt"
	"math/big"
	"math"

	"github.com/fluidity-money/fluidity-app/lib/types/applications"
	"github.com/fluidity-money/fluidity-app/common/ethereum"
	"github.com/fluidity-money/fluidity-app/lib/types/worker"
	ethTypes "github.com/fluidity-money/fluidity-app/lib/types/ethereum"
	"github.com/fluidity-money/fluidity-app/lib/log"

	ethAbi "github.com/ethereum/go-ethereum/accounts/abi"
	"github.com/ethereum/go-ethereum/ethclient"
	ethCommon "github.com/ethereum/go-ethereum/common"
)

const paraswapV3AbiString = `[
  {
    "type": "event",
    "name": "SwappedV3",
    "inputs": [
      {
        "name": "uuid",
        "type": "bytes16",
        "indexed": false,
        "internalType": "bytes16"
      },
      {
        "name": "partner",
        "type": "address",
        "indexed": false,
        "internalType": "address"
      },
      {
        "name": "feePercent",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "initiator",
        "type": "address",
        "indexed": false,
        "internalType": "address"
      },
      {
        "name": "beneficiary",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "srcToken",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "destToken",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "srcAmount",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "receivedAmount",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "expectedAmount",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "BoughtV3",
    "inputs": [
      {
        "name": "uuid",
        "type": "bytes16",
        "indexed": false,
        "internalType": "bytes16"
      },
      {
        "name": "partner",
        "type": "address",
        "indexed": false,
        "internalType": "address"
      },
      {
        "name": "feePercent",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "initiator",
        "type": "address",
        "indexed": false,
        "internalType": "address"
      },
      {
        "name": "beneficiary",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "srcToken",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "destToken",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "srcAmount",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "receivedAmount",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "expectedAmount",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  }
]
`

var paraswapV3Abi ethAbi.ABI

const (
	paraswapSwappedV3Topic = "0xe00361d207b252a464323eb23d45d42583e391f2031acdd2e9fa36efddd43cb0"
	paraswapBoughtV3Topic = "0x4cc7e95e48af62690313a0733e93308ac9a73326bc3c29f1788b1191c376d5b6"
)

// convertAddress by taking off the left side of zeroes from a normally
// packed hex string. returns the zero address if it fails to do so.
func convertAddress(address interface{}) (ethCommon.Address, error) {
	zero := ethCommon.HexToAddress("0x0000000000000000000000000000000000000000")

	switch v := address.(type) {
	case ethTypes.Hash:
		s := v.String()

		if ethCommon.IsHexAddress(s) {
			return zero, fmt.Errorf(
				"the hex string stripped (%v) is not a valid address",
				s,
			)
		}

		addr := ethCommon.HexToAddress(v.String())

		return addr, nil

	default:
		return zero, fmt.Errorf(
			"failed to decode an address, type was %T (%v), wanted ethCommon.Hash",
			v,
			v,
		)
	}
}

// GetParaswapFees breaks down either the SwappedV3, or the BoughtV3 log.
// Does a comparison of which side has which token to determine what the
// amount of volume was transferred is
func GetParaswapFees(transfer worker.EthereumApplicationTransfer, client *ethclient.Client, fluidTokenContract ethCommon.Address, tokenDecimals int) (feeData applications.ApplicationFeeData, err error) {
	transferLog := transfer.Log

	topics := transferLog.Topics

	if len(transferLog.Topics) < 1 {
		return feeData, fmt.Errorf("not enough log topics passed!")
	}

	transferLogData := transfer.Log.Data

	logTopic := topics[0].String()

	// TODO: fees are not tracked with Paraswap

	var unpacked []interface{}

	// check the log topic, and decode according to which one is
	// used. then set the unpacked, for the rest of the function to
	// decode.

	switch logTopic {
	case paraswapSwappedV3Topic:
		unpacked, err = paraswapV3Abi.Unpack("SwappedV3", transferLogData)

		if err != nil {
			return feeData, fmt.Errorf(
				"failed to unpack a SwappedV3 log: %v",
				err,
			)
		}

	case paraswapBoughtV3Topic:
		unpacked, err = paraswapV3Abi.Unpack("BoughtV3", transferLogData)

		if err != nil {
			return feeData, fmt.Errorf(
				"failed to unpack a BoughtV3 log: %v",
				err,
			)
		}

	default:
		// we didn't find anything!
		return feeData, nil
	}

	// SwappedV3 and BoughtV3 are the same, except for the first
	// topic. so we process them as the same.

	if l := len(unpacked); l != 7 {
		return feeData, fmt.Errorf(
			"unpacked the wrong number of values for SwappedV3! Expected 7, got %v",
			l,
		)
	}

	if l := len(topics); l != 4 {
		return feeData, fmt.Errorf(
			"unpacked the wrong number of topics for SwappedV3! Expected 4, got %v",
			l,
		)
	}

	var (
		//contract = topics[0]
		//beneficiary_ = topics[1]
		srcToken_ = topics[2]
		destToken_ = topics[3]
	)

	// UNIMPLEMENTED: support for feePercent
	var (
		//uuid = unpacked[0]
		//partner = unpacked[1]
		//feePercent = unpacked[2]
		//initiator = unpacked[3]
		srcAmount_ = unpacked[4]
		receivedAmount_ = unpacked[5]
		//expectedAmount = unpacked[6]
	)

	srcToken, err := convertAddress(srcToken_)

	if err != nil {
		return feeData, fmt.Errorf(
			"failed to coerce the srcToken (%v) to address: %v",
			srcToken_,
			err,
		)
	}

	destToken, err := convertAddress(destToken_)

	if err != nil {
		return feeData, fmt.Errorf(
			"failed to coerce the destToken to address: %v",
			err,
		)
	}

	srcAmount, err := ethereum.CoerceBoundContractResultsToRat(
		[]interface{}{srcAmount_},
	)

	if err != nil {
		return feeData, fmt.Errorf(
			"failed to coerce srcAmount to *big.Rat: %v",
			err,
		)
	}

	receivedAmount, err := ethereum.CoerceBoundContractResultsToRat(
		[]interface{}{receivedAmount_},
	)

	if err != nil {
		return feeData, fmt.Errorf(
			"failed to coerce receivedAmount to *big.Rat: %v",
			err,
		)
	}

	fluidTransferAmount := new(big.Rat)

	switch fluidTokenContract {
	case srcToken:
		fluidTransferAmount.Set(srcAmount)

	case destToken:
		fluidTransferAmount.Set(receivedAmount)

	default:
		log.Debugf(
			"failed to decode the volume for paraswap transaction hash %v: fluid contract address %v is not srcToken %v nor destToken %v",
			transfer.TransactionHash,
			fluidTokenContract,
			srcToken,
			destToken,
		)
		return feeData, nil
	}

	decimalsAdjusted := math.Pow10(tokenDecimals)
	decimalsRat := new(big.Rat).SetFloat64(decimalsAdjusted)

	feeData.Volume = new(big.Rat).Quo(fluidTransferAmount, decimalsRat)
	feeData.Fee = new(big.Rat).SetInt64(0)

	return feeData, nil

}