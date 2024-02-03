// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package odos

import (
	"fmt"
	"math"
	"math/big"

	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/common/ethereum"
	"github.com/fluidity-money/fluidity-app/lib/types/applications"
	"github.com/fluidity-money/fluidity-app/lib/types/worker"

	ethAbi "github.com/ethereum/go-ethereum/accounts/abi"
	ethCommon "github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/ethclient"
)

// TODO: fees are not supported.

const odosSwapLogTopic = "0x823eaf01002d7353fbcadb2ea3305cc46fa35d799cb0914846d185ac06f8ad05"

const odosSwapAbiString = `[
    {
        "anonymous": false,
        "inputs": [
            {"indexed": false, "internalType": "address", "name": "sender", "type": "address"},
            {"indexed": false, "internalType": "uint256", "name": "inputAmount", "type": "uint256"},
            {"indexed": false, "internalType": "address", "name": "inputToken", "type": "address"},
            {"indexed": false, "internalType": "uint256", "name": "amountOut", "type": "uint256"},
            {"indexed": false, "internalType": "address", "name": "outputToken", "type": "address"},
            {"indexed": false, "internalType": "int256", "name": "slippage", "type": "int256"},
            {"indexed": false, "internalType": "uint32", "name": "referralCode", "type": "uint32"}
        ],
        "name": "Swap",
        "type": "event"
    }
]`

var odosSwapAbi ethAbi.ABI

func GetOdosFees(transfer worker.EthereumApplicationTransfer, client *ethclient.Client, fluidTokenContract ethCommon.Address, tokenDecimals int) (feeData applications.ApplicationFeeData, err error) {
	if len(transfer.Log.Topics) < 1 {
		return feeData, fmt.Errorf("not enough log topics passed!")
	}

	logTopic := transfer.Log.Topics[0].String()

	if logTopic != odosSwapLogTopic {
		return feeData, nil
	}

	unpacked, err := odosSwapAbi.Unpack("Swap", transfer.Log.Data)

	if err != nil {
		return feeData, fmt.Errorf(
			"failed to unpack swap log data! %v",
			err,
		)
	}

	if len(unpacked) != 7 {
		return feeData, fmt.Errorf(
			"unpacked the wrong number of values! Expected %v, got %v",
			7,
			len(unpacked),
		)
	}

	//sender := unpacked[0]

	amountInput, err := ethereum.CoerceBoundContractResultsToRat(
		[]interface{}{unpacked[1]},
	)

	if err != nil {
		return feeData, fmt.Errorf(
			"failed to coerce amountInput to *big.Rat: %v",
			err,
		)
	}

	inputToken, err := ethereum.CoerceBoundContractResultsToAddress(
		[]interface{}{unpacked[2]},
	)

	if err != nil {
		return feeData, fmt.Errorf(
			"failed to coerce inputToken to address: %v",
			err,
		)
	}

	amountOut, err := ethereum.CoerceBoundContractResultsToRat(
		[]interface{}{unpacked[3]},
	)

	if err != nil {
		return feeData, fmt.Errorf(
			"failed to coerce amountOut to *big.Rat: %v",
			err,
		)
	}

	outputToken, err := ethereum.CoerceBoundContractResultsToAddress(
		[]interface{}{unpacked[4]},
	)

	if err != nil {
		return feeData, fmt.Errorf(
			"failed to coerce outputToken to address: %v",
			err,
		)
	}

	//slippage := unpacked[5]
	//referralCode := unpacked[6]

	fluidTransferAmount := new(big.Rat)

	switch fluidTokenContract {
	case inputToken:
		fluidTransferAmount.Set(amountInput)

	case outputToken:
		fluidTransferAmount.Set(amountOut)

	default:
		log.Debugf(
			"failed to decode the volume for transaction hash %v: fluid contract address %v is not inputToken (%v) nor is outputToken (%v)",
			transfer.TransactionHash,
			fluidTokenContract,
			inputToken,
			outputToken,
		)

		return feeData, nil
	}

	decimalsAdjusted := math.Pow10(tokenDecimals)
	decimalsRat := new(big.Rat).SetFloat64(decimalsAdjusted)

	feeData.Volume = new(big.Rat).Quo(fluidTransferAmount, decimalsRat)
	feeData.Fee = new(big.Rat).SetInt64(0)

	return feeData, nil
}
