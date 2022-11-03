// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package solana

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"github.com/fluidity-money/fluidity-app/lib/log"
	types "github.com/fluidity-money/fluidity-app/lib/types/solana"
)

const (
	// BlockNotAvailableCode is the error code returned by solana if a block
	// is not yet available (that is, the block hasn't been produced yet)
	BlockNotAvailableCode = -32004

	// SlotSkippedCode is the error code returned by solana if a slot was
	// skipped or not included in storage (and will never become available)
	SlotSkippedCode = -32009
)

var (
	// Solana sometimes leaves this value out, indicating legacy txs
	TransactionVersionLegacyUnset []byte

	// legacy transactions
	TransactionVersionLegacy = []byte(`"legacy"`)

	// version 0 transactions, including account lookup tables
	TransactionVersion0 = []byte(`0`)
)
type (
	Block struct {
		Blockhash    string                    `json:"blockhash"`
		Transactions []types.TransactionResult `json:"transactions"`
	}
	RpcError struct {
		Code    int    `json:"code"`
		Message string `json:"message"`
	}
	rpcBlock struct {
		Result Block     `json:"result"`
		Error  *RpcError `json:"error"`
	}

	// rpc return type for the getTransaction endpoint using jsonParsed encoding
	rpcParsedJsonTransaction struct {
		Error *RpcError `json:"error"`
		Result struct {
			Transaction struct {
				Message struct {
					AccountKeys []struct {
						Pubkey string `json:"pubkey"`
					} `json:"accountKeys"`
				} `json:"message"`
			} `json:"transaction"`
		} `json:"result"`
	}
)

// GetBlock gets a full block by its slot
func GetBlock(rpcUrl string, slot uint64, retries, delay int) (*Block, error) {
	request := map[string]interface{}{
		"jsonrpc": "2.0",
		"id":      1,
		"method":  "getBlock",
		"params": []interface{}{
			slot,
			map[string]interface{}{
				"encoding":                       "json",
				"transactionDetails":             "full",
				"rewards":                        false,
				"commitment":                     "confirmed",
				"maxSupportedTransactionVersion": 0,
			},
		},
	}

	remainingRetries := retries
	for {
		requestBuf := new(bytes.Buffer)
		encoder := json.NewEncoder(requestBuf)

		err := encoder.Encode(request)

		if err != nil {
			return nil, fmt.Errorf("Failed to encode RPC call: %w", err)
		}

		r, err := http.Post(
			rpcUrl,
			"application/json",
			requestBuf,
		)

		if err != nil {
			return nil, fmt.Errorf("Failed to make an RPC call: %w", err)
		}

		defer r.Body.Close()

		reader := json.NewDecoder(r.Body)

		var blockRes rpcBlock

		if err := reader.Decode(&blockRes); err != nil {
			return nil, fmt.Errorf("Failed decoding RPC response: %w", err)
		}

		if blockRes.Error != nil {
			code := blockRes.Error.Code

			// slot was skipped - it will never become available - return
			if code == SlotSkippedCode {
				return nil, nil
			}

			if remainingRetries > 0 {
				// slot isn't available yet - retry
				if code == BlockNotAvailableCode {
					log.Debug(func(k *log.Log) {
						k.Format(
							"Slot %d not available yet! sleeping for %d seconds before retrying",
							slot,
							delay,
						)
					})
					duration := time.Duration(delay) * time.Second
					time.Sleep(duration)

					remainingRetries--
					continue
				}
			}

			return nil, fmt.Errorf(
				"Error getting a block from solana! %+v",
				blockRes.Error,
			)
		}

		if err := fetchSolanaAccountList(rpcUrl, &blockRes.Result); err != nil {
			return nil, err
		}

		return &blockRes.Result, nil
	}
}

func fetchSolanaAccountList(rpcUrl string, block *Block) error {
	for i, txn := range block.Transactions {
		var (
			versionLegacyUnset = bytes.Equal(txn.Version, TransactionVersionLegacyUnset)
			versionLegacy = bytes.Equal(txn.Version, TransactionVersionLegacy)
		)

		if versionLegacyUnset || versionLegacy {
			continue
		} else if !bytes.Equal(txn.Version, TransactionVersion0) {
			return fmt.Errorf("unknown transaction version: %+v", txn.Version)
		}

		lookups := txn.Transaction.Message.AddressTableLookups

		if len(lookups) == 0 {
			// transaction doesn't use lookups - don't need to do anything
			continue
		}

		// transaction uses account lookups - fetch the parsed json format
		var (
			txnSignature = txn.Transaction.Signatures[0]

			request = map[string]interface{}{
				"jsonrpc": "2.0",
				"id":      1,
				"method":  "getTransaction",
				"params": []interface{}{
					txnSignature,
					map[string]interface{}{
						"encoding":                       "jsonParsed",
						"commitment":                     "confirmed",
						"maxSupportedTransactionVersion": 0,
					},
				},
			}
		)

		requestBuf := new(bytes.Buffer)
		encoder := json.NewEncoder(requestBuf)

		err := encoder.Encode(request)

		if err != nil {
			return fmt.Errorf("Failed to encode RPC call: %w", err)
		}

		r, err := http.Post(
			rpcUrl,
			"application/json",
			requestBuf,
		)

		if err != nil {
			return fmt.Errorf("Failed to make an RPC call: %w", err)
		}

		defer r.Body.Close()

		reader := json.NewDecoder(r.Body)

		var transactionRes rpcParsedJsonTransaction

		if err := reader.Decode(&transactionRes); err != nil {
			return fmt.Errorf("Failed decoding RPC response: %w", err)
		}

		if transactionRes.Error != nil {
			return fmt.Errorf(
				"Error getting a transaction from solana! %+v",
				transactionRes.Error,
			)
		}

		var (
			accounts = transactionRes.Result.Transaction.Message.AccountKeys
			accountKeys = make([]string, len(accounts))
		)

		for i, acc := range accounts {
			accountKeys[i] = acc.Pubkey
		}

		newTxn := txn

		newTxn.Transaction.Message.AccountKeys = accountKeys

		block.Transactions[i] = newTxn
	}

	return nil
}
