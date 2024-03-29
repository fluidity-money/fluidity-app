// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package microservice_ethereum_block_fluid_transfers_amqp

import (
	"encoding/json"

	types "github.com/fluidity-money/fluidity-app/lib/types/ethereum"
)

type (
	GethBody struct {
		JsonRpc string      `json:"jsonrpc"`
		Method  string      `json:"method"`
		Params  interface{} `json:"params"`
		Id      string      `json:"id"`
	}

	LogParams [1]struct {
		BlockHash string   `json:"blockHash"`
		Topics    []string `json:"topics"`
	}

	BlockParams [2]interface{}

	Log struct {
		Address     string   `json:"address"`
		Topics      []string `json:"topics"`
		Data        string   `json:"data"`
		BlockNumber string   `json:"blockNumber"`
		TxHash      string   `json:"transactionHash"`
		TxIndex     string   `json:"transactionIndex"`
		BlockHash   string   `json:"blockHash"`
		Index       string   `json:"logIndex"`
		Removed     bool     `json:"removed"`
	}

	LogsResponse struct {
		JsonRpc string `json:"jsonrpc"`
		Id      string `json:"id"`
		Result  []Log  `json:"result"`
	}

	// Transaction is eth_blockByHash return data
	Transaction struct {
		BlockHash   types.Hash `json:"blockHash"`
		BlockNumber hexInt     `json:"blockNumber"`

		From types.Address `json:"from"`

		GasPrice             hexInt `json:"gasPrice"`
		MaxFeePerGas         hexInt `json:"maxFeePerGas"`
		MaxPriorityFeePerGas hexInt `json:"maxPriorityFeePerGas"`

		Hash types.Hash `json:"hash"`

		// Data encoded as a hex byte array received in the form of a string
		Data string `json:"input"`

		To types.Address `json:"to"`

		// Type encoded as a hex uint8
		Type hexInt `json:"type"`
	}

	// Block is eth_getBlockByHash's result. Does not match
	// ethereum's internal Block structure
	Block struct {
		Difficulty       string        `json:"difficulty"`
		ExtraData        string        `json:"extraData"`
		GasLimit         string        `json:"gasLimit"`
		GasUsed          string        `json:"gasUsed"`
		Hash             types.Address `json:"hash"`
		LogsBloom        string        `json:"logsBloom"`
		Miner            string        `json:"miner"`
		MixHash          string        `json:"mixHash"`
		Nonce            string        `json:"nonce"`
		Number           string        `json:"number"`
		ParentHash       string        `json:"parentHash"`
		ReceiptsRoot     string        `json:"receiptsRoot"`
		Sha3Uncles       string        `json:"sha3Uncles"`
		Size             string        `json:"size"`
		StateRoot        string        `json:"stateRoot"`
		Timestamp        string        `json:"timestamp"`
		TotalDifficulty  string        `json:"totalDifficulty"`
		Transactions     []Transaction `json:"transactions"`
		TransactionsRoot string        `json:"transactionsRoot"`
		Uncles           []interface{} `json:"uncles"`
	}

	BlocksResponse struct {
		JsonRpc string `json:"jsonrpc"`
		Id      string `json:"id"`
		// this can be Block or null
		Result json.RawMessage `json:"result"`
	}
)
