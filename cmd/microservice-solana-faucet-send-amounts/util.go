package main

import (
	"context"
	"fmt"

	"github.com/gagliardetto/solana-go"
	solanaRpc "github.com/gagliardetto/solana-go/rpc"
)

func getBlockHash(client *solanaRpc.Client) (*solana.Hash, error) {
	blockHashResult, err := client.GetRecentBlockhash(context.Background(), "finalized")

	if err != nil {
		return nil, fmt.Errorf(
			"failed to get the most recent block hash! %v",
			err,
		)
	}

	if blockHashResult == nil {
		return nil, nil
	}

	blockHash := blockHashResult.Value.Blockhash

	return &blockHash, nil
}
