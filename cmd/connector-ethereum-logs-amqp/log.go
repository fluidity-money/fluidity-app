package main

import (
	"github.com/fluidity-money/fluidity-app/lib/types/ethereum"

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
		BlockNumber: log.BlockNumber,
		TxHash:      ethereum.HashFromString(log.TxHash.Hex()),
		TxIndex:     log.TxIndex,
		BlockHash:   ethereum.HashFromString(log.BlockHash.Hex()),
		Index:       log.Index,
	}
}
