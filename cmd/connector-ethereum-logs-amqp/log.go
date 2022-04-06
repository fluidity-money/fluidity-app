package main

import (
	"github.com/fluidity-money/fluidity-app/lib/types/ethereum"
	"github.com/fluidity-money/fluidity-app/lib/types/misc"

	ethTypes "github.com/ethereum/go-ethereum/core/types"
)

func convertGethLog(log ethTypes.Log) ethereum.Log {
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
