// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package gtrade

import (
	"fmt"
	"math"
	"math/big"
	"sort"

	ethAbi "github.com/ethereum/go-ethereum/accounts/abi"
	ethCommon "github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/ethclient"
	"github.com/fluidity-money/fluidity-app/common/ethereum"
	ethTypes "github.com/fluidity-money/fluidity-app/lib/types/ethereum"
	"github.com/fluidity-money/fluidity-app/lib/types/worker"
)

const gtradeV6_1FeesChargedLogTopic = "0x3a484d35e7358ad950e494938ebbac2c1319c2b76d162112f51d66752244dde3"

const gtradeV6_1AbiString = `[
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "pairIndex",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "bool",
          "name": "long",
          "type": "bool"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "collateral",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "leverage",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "int256",
          "name": "percentProfit",
          "type": "int256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "rolloverFees",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "int256",
          "name": "fundingFees",
          "type": "int256"
        }
      ],
      "name": "FeesCharged",
      "type": "event"
    },
    {
      "inputs": [],
      "name": "storageT",
      "outputs": [
        {
          "internalType": "address",
          "name": "storage",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
]`

const erc20AbiString = `[
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "from",
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
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "Transfer",
      "type": "event"
    }
]`

// gtradeV6_1PairAbi set by init.go to generate the ABI code
var gtradeV6_1PairAbi ethAbi.ABI

// erc20Abi set by init.go to generate the ERC20 Transfer struct
var erc20Abi ethAbi.ABI

// GetGtradeV6_1Fees returns Gtrade V6_1's fee of the amount swapped.
// GTrade fees are split into 3 components, RolloverFee, FundingFee
// (which may be negative in cases of rewards), and ClosingFee.
// These fees are transferred to the Pool 'Manager', as well as the token
// We find and add these transfers to calculate the fees
func GetGtradeV6_1Fees(transfer worker.EthereumApplicationTransfer, client *ethclient.Client, fluidTokenContract ethCommon.Address, tokenDecimals int, txReceipt ethTypes.Receipt) (*big.Rat, error) {
	// decode the amount of each token in the log
	// doesn't contain addresses, as they're indexed
	if len(transfer.Log.Topics) < 1 {
		return nil, fmt.Errorf("No log topics passed!")
	}

	logTopic := transfer.Log.Topics[0].String()

	if logTopic != gtradeV6_1FeesChargedLogTopic {
		return nil, fmt.Errorf(
			"Incorrect Log Topic (%v, expected %v)",
			logTopic,
			gtradeV6_1FeesChargedLogTopic,
		)
	}

	unpacked, err := gtradeV6_1PairAbi.Unpack("FeesCharged", transfer.Log.Data)

	if err != nil {
		return nil, fmt.Errorf(
			"Failed to unpack swap log data! %v",
			err,
		)
	}

	expectedUnpackedLen := 7
	if len(unpacked) != expectedUnpackedLen {
		return nil, fmt.Errorf(
			"Unpacked the wrong number of values! Expected %v, got %v",
			expectedUnpackedLen,
			len(unpacked),
		)
	}

	// convert the pair contract's address to the go ethereum address type
	contractAddr := ethereum.ConvertInternalAddress(transfer.Log.Address)

	// storageT is the contract that stores deposited tokens
	storageT_, err := ethereum.StaticCall(client, contractAddr, gtradeV6_1PairAbi, "storageT")

	if err != nil {
		return nil, fmt.Errorf(
			"Failed to get storageT address! %v",
			err,
		)
	}

	storageT, err := ethereum.CoerceBoundContractResultsToAddress(storageT_)

	if err != nil {
		return nil, fmt.Errorf(
			"Failed to coerce storageT address! %v",
			err,
		)
	}

	// Get all logs in transaction
	txHash := ethereum.ConvertInternalHash(transfer.TransactionHash)

	txLogs := txReceipt.Logs

	// Binary search through logs until we find matching log
	feesChargedLogBlockIndex := uint(transfer.Log.Index.Uint64())

	feesChargedLogTxIndex := sort.Search(len(txLogs), func(i int) bool {
		// txLogs.Index sorted in ascending order, so use >= op
		return feesChargedLogBlockIndex >= uint(txLogs[i].Index.Uint64())
	})

	// firstFeeSwap log should occur right after FeesCharged log
	firstFeeTransferLogTxIndex := feesChargedLogTxIndex + 1

	// secondFeeSwap log should occur 6 logs after FeesCharged log
	secondFeeTransferLogTxIndex := feesChargedLogTxIndex + 6

	// assert corresponding last fee swap exists
	if secondFeeTransferLogTxIndex >= len(txLogs) {
		return nil, fmt.Errorf(
			"failed to find enough transfer logs from txHash (%v) for feesCharged (%v)! %v",
			txHash.String(),
			transfer.TransactionHash,
			err,
		)
	}

	// Get first fee transfer amount
	firstFeeTransferLog := txLogs[firstFeeTransferLogTxIndex]

	unpacked, err = erc20Abi.Unpack("Transfer", firstFeeTransferLog.Data)

	if err != nil {
		return nil, fmt.Errorf(
			"Failed to unpack Transfer log data! %v",
			err,
		)
	}

	expectedUnpackedLen = 1
	if len(unpacked) != expectedUnpackedLen {
		return nil, fmt.Errorf(
			"Unpacked the wrong number of values! Expected %v, got %v",
			expectedUnpackedLen,
			len(unpacked),
		)
	}

	// Check token is fluid, otherwise err
	contractAddr = ethereum.ConvertInternalAddress(transfer.Log.Address)
	if contractAddr != fluidTokenContract {
		return nil, fmt.Errorf(
			"First GTrade Fee Transfer in transaction %#v does not involve fluid token - skipping!",
			transfer.TransactionHash.String(),
		)
	}

	// Check Sender is GTrade Storage
	sender := ethCommon.HexToAddress(firstFeeTransferLog.Topics[1].String())
	if sender != storageT {
		return nil, fmt.Errorf(
			"Unexpected Sender (%v) in GTrade Fee Transfer (Expected %v)",
			sender.String(),
			storageT.String(),
		)
	}

	// firstFee is the amount of the first fee transfer
	feeBuffer := []interface{}{unpacked[0]}
	firstFee, err := ethereum.CoerceBoundContractResultsToRat(feeBuffer)

	if err != nil {
		return nil, fmt.Errorf(
			"Failed to coerce firstFee to rat! %v",
			err,
		)
	}

	// Get second fee transfer amount
	secondFeeTransferLog := txLogs[secondFeeTransferLogTxIndex]

	unpacked, err = erc20Abi.Unpack("Transfer", secondFeeTransferLog.Data)

	if err != nil {
		return nil, fmt.Errorf(
			"Failed to unpack SourceChainSwap log data! %v",
			err,
		)
	}

	expectedUnpackedLen = 1

	if len(unpacked) != expectedUnpackedLen {
		return nil, fmt.Errorf(
			"Unpacked the wrong number of values! Expected %v, got %v",
			expectedUnpackedLen,
			len(unpacked),
		)
	}

	// Check token is fluid, otherwise err
	contractAddr = ethereum.ConvertInternalAddress(transfer.Log.Address)
	if contractAddr != fluidTokenContract {
		return nil, fmt.Errorf(
			"First GTrade Fee Transfer in transaction %#v does not involve fluid token - skipping!",
			transfer.TransactionHash.String(),
		)
	}

	// Check Sender is GTrade Storage
	sender = ethCommon.HexToAddress(secondFeeTransferLog.Topics[1].String())
	if sender != storageT {
		return nil, fmt.Errorf(
			"Unexpected Sender (%v) in GTrade Fee Transfer (Expected %v)",
			sender.String(),
			storageT.String(),
		)
	}

	// secondFee is the amount of the second fee transfer
	feeBuffer[0] = unpacked[0]
	secondFee, err := ethereum.CoerceBoundContractResultsToRat(feeBuffer)

	if err != nil {
		return nil, fmt.Errorf(
			"Failed to coerce secondFee to rat! %v",
			err,
		)
	}

	fee := new(big.Rat).Add(firstFee, secondFee)

	// adjust by decimals to get the price in USD
	decimalsAdjusted := math.Pow10(tokenDecimals)
	decimalsRat := new(big.Rat).SetFloat64(decimalsAdjusted)

	fee.Quo(fee, decimalsRat)

	return fee, nil
}
