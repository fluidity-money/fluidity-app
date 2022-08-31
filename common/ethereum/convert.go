// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package ethereum

import (
	"math/big"

	"github.com/fluidity-money/fluidity-app/lib/types/ethereum"
	"github.com/fluidity-money/fluidity-app/lib/types/misc"

	ethTypes "github.com/ethereum/go-ethereum/core/types"
)

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

// ConvertHeader from the ethereum definition into its internal type
// equivalent
func ConvertHeader(oldHeader *ethTypes.Header) ethereum.BlockHeader {

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
