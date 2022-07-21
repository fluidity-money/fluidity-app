// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package solana

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"

	types "github.com/fluidity-money/fluidity-app/lib/types/solana"
)

type (
	Block struct {
		Blockhash    string                    `json:"blockhash"`
		Transactions []types.TransactionResult `json:"transactions"`
	}
	rpcBlock struct {
		Result Block                  `json:"result"`
		Error  map[string]interface{} `json:"error"`
	}
)

// GetBlock gets a full block by its slot
func GetBlock(rpcUrl string, slot uint64) (Block, error) {
	request := map[string]interface{}{
		"jsonrpc": "2.0",
		"id":      1,
		"method":  "getBlock",
		"params": []interface{}{
			slot,
			map[string]interface{}{
				"encoding":           "json",
				"transactionDetails": "full",
				"rewards":            false,
				"commitment":         "confirmed",
			},
		},
	}

	requestBuf := new(bytes.Buffer)
	encoder := json.NewEncoder(requestBuf)

	err := encoder.Encode(request)

	if err != nil {
		return Block{}, fmt.Errorf("Failed to encode RPC call: %w", err)
	}

	r, err := http.Post(
		rpcUrl,
		"application/json",
		requestBuf,
	)

	if err != nil {
		return Block{}, fmt.Errorf("Failed to make an RPC call: %w", err)
	}

	defer r.Body.Close()

	reader := json.NewDecoder(r.Body)

	var blockRes rpcBlock

	if err := reader.Decode(&blockRes); err != nil {
		return Block{}, fmt.Errorf("Failed decoding RPC response: %w", err)
	}

	if blockRes.Error != nil {
		return Block{}, fmt.Errorf("RPC request error: %v", blockRes.Error)
	}

	return blockRes.Result, nil
}
