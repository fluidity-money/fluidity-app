package main

import (
	ethTypes "github.com/ethereum/go-ethereum/core/types"
	types "github.com/fluidity-money/fluidity-app/lib/types/ethereum"
)

func convertGethLog(log ethTypes.Log) types.Log {
	topics := make([]types.Hash, len(log.Topics))

	for i, topic := range log.Topics {
		topics[i] = types.Hash(topic.Hex())
	}

	return types.Log{
		Address:     types.AddressFromString(log.Address.Hex()),
		Topics:      topics,
		Data:        log.Data,
		BlockNumber: log.BlockNumber,
		TxHash:      types.HashFromString(log.TxHash.Hex()),
		TxIndex:     log.TxIndex,
		BlockHash:   types.HashFromString(log.BlockHash.Hex()),
		Index:       log.Index,
	}
}
