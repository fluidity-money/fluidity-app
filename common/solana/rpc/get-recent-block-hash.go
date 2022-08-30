package rpc

import (
	"encoding/json"
	"fmt"

	"github.com/fluidity-money/fluidity-app/common/solana"
)

type GetRecentBlockhashResult struct {
	RpcContext

	Value *struct {
		Blockhash     solana.Hash `json:"blockhash"`
		FeeCalculator struct {
			LamportsPerSignature uint64 `json:"lamportsPerSignature"`
		} `json:"feeCalculator"`
	} `json:"value"`
}

func (s *Provider) GetRecentBlockhash(commitment string) (*GetRecentBlockhashResult, error) {
	params := []interface{}{}

	if commitment != "" {
		params = append(params, map[string]string{
			"commitment": commitment,
		})
	}

	raw, err := s.RawInvoke("getRecentBlockhash", params)

	if err != nil {
		return nil, fmt.Errorf(
			"failed to getRecentBlock: %v",
			err,
		)
	}

	var recentBlockhashResult GetRecentBlockhashResult

	if err := json.Unmarshal(raw, &recentBlockhashResult); err != nil {
		return nil, fmt.Errorf(
			"failed to decode getRecentBlockhash, message %#v: %v",
			string(raw),
			err,
		)
	}

	return &recentBlockhashResult, nil
}
