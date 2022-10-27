// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package ethereum

import (
	"math/big"

	"github.com/fluidity-money/fluidity-app/lib/types/ethereum"
	"github.com/fluidity-money/fluidity-app/lib/types/misc"

	ethCommon "github.com/ethereum/go-ethereum/common"
	ethTypes "github.com/ethereum/go-ethereum/core/types"
)

// ConvertGethHash from the ethereum definition into its internal type
// equivalent
func ConvertGethHash(hash ethCommon.Hash) ethereum.Hash {
	hashString := hash.Hex()

	return ethereum.HashFromString(hashString)
}

// ConvertGethAddress from the ethereum definition into its internal type
// equivalent
func ConvertGethAddress(address ethCommon.Address) ethereum.Address {
	addressString := address.String()

	return ethereum.AddressFromString(addressString)
}

// ConvertGethLog from the ethereum definition into its internal type
// equivalent
func ConvertGethLog(log ethTypes.Log) ethereum.Log {
	topics := make([]ethereum.Hash, len(log.Topics))

	for i, topic := range log.Topics {
		topics[i] = ethereum.Hash(topic.Hex())
	}

	return ethereum.Log{
		Address:     ethereum.AddressFromString(log.Address.Hex()),
		Topics:      topics,
		Data:        log.Data,
		BlockNumber: misc.BigIntFromUint64(log.BlockNumber),
		TxHash:      ethereum.HashFromString(log.TxHash.Hex()),
		TxIndex:     misc.BigIntFromUint64(uint64(log.TxIndex)),
		BlockHash:   ethereum.HashFromString(log.BlockHash.Hex()),
		Index:       misc.BigIntFromUint64(uint64(log.Index)),
	}
}

// ConvertGethLogs converts an array of geth logs to its internal type
// equivalent
func ConvertGethLogs(logs []*ethTypes.Log) []ethereum.Log {
	var newLogs []ethereum.Log

	for _, log := range logs {
		if log == nil {
			continue
		}

		newLogs = append(newLogs, ConvertGethLog(*log))
	}

	return newLogs
}

// ConvertGethHeader from the ethereum definition into its internal type
// equivalent
func ConvertGethHeader(oldHeader *ethTypes.Header) ethereum.BlockHeader {

	var difficulty, number, baseFee big.Int

	if difficulty_ := oldHeader.Difficulty; difficulty_ != nil {
		difficulty = *difficulty_
	}

	if number_ := oldHeader.Number; number_ != nil {
		number = *number_
	}

	if baseFee_ := oldHeader.BaseFee; baseFee_ != nil {
		baseFee = *baseFee_
	}

	receiptHash := oldHeader.ReceiptHash.Hex()

	return ethereum.BlockHeader{
		BlockHash:       ethereum.HashFromString(oldHeader.Hash().Hex()),
		ParentHash:      ethereum.HashFromString(oldHeader.ParentHash.Hex()),
		UncleHash:       ethereum.HashFromString(oldHeader.UncleHash.Hex()),
		Coinbase:        ethereum.AddressFromString(oldHeader.Coinbase.Hex()),
		Root:            ethereum.HashFromString(oldHeader.Root.Hex()),
		TransactionHash: ethereum.HashFromString(oldHeader.TxHash.Hex()),
		Bloom:           oldHeader.Bloom.Bytes(),
		Difficulty:      misc.NewBigInt(difficulty),
		Number:          misc.NewBigInt(number),
		GasLimit:        misc.BigIntFromUint64(oldHeader.GasLimit),
		GasUsed:         misc.BigIntFromUint64(oldHeader.GasUsed),
		Time:            oldHeader.Time,
		Extra:           oldHeader.Extra,
		MixDigest:       ethereum.HashFromString(oldHeader.MixDigest.Hex()),
		Nonce:           ethereum.BlockNonce(oldHeader.Nonce[:]),
		ReceiptHash:     ethereum.HashFromString(receiptHash),
		BaseFee:         misc.NewBigInt(baseFee),
	}
}

func ConvertGethReceipt(receipt ethTypes.Receipt) ethereum.Receipt {
	var (
		postState_ = receipt.PostState
		bloom_ = receipt.Bloom
		logs_ = receipt.Logs
		txHash_ = receipt.TxHash
		contractAddress_ = receipt.ContractAddress
		gasUsed_ = receipt.GasUsed
		blockHash_ = receipt.BlockHash
		blockNumber_ = receipt.BlockNumber
	)

	return ethereum.Receipt{
		Type:              receipt.Type,
		PostState:         misc.Blob(postState_),
		Status:            receipt.Status,
		CumulativeGasUsed: receipt.CumulativeGasUsed,
		Bloom:             misc.Blob(bloom_.Bytes()),
		Logs:              ConvertGethLogs(logs_),
		TransactionHash:   ConvertGethHash(txHash_),
		ContractAddress:   ConvertGethAddress(contractAddress_),
		GasUsed:           misc.BigIntFromUint64(gasUsed_),
		BlockHash:         ConvertGethHash(blockHash_),
		BlockNumber:       misc.NewBigInt(*blockNumber_),
		TransactionIndex:  receipt.TransactionIndex,
	}
}
