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
type (
	Block struct {
		Blockhash    string                    `json:"blockhash"`
		Transactions []types.TransactionResult `json:"transactions"`
	}
	GetBlockError struct {
		Code    int    `json:"code"`
		Message string `json:"message"`
	}
	rpcBlock struct {
		Result Block          `json:"result"`
		Error  *GetBlockError `json:"error"`
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
						k.Format("Slot %d not available yet! sleeping for %d seconds before retrying")
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

		return &blockRes.Result, nil
	}
}
