package rpc

import (
	"encoding/json"
	"fmt"

	"github.com/fluidity-money/fluidity-app/common/solana"
)

type GetTokenSupplyResult struct {
	RpcContext

	Value *struct {
		// Raw amount of tokens as a string, ignoring decimals.
		Amount string `json:"amount"`

		// TODO: <number> == int64 ???
		// Number of decimals configured for token's mint.
		Decimals uint8 `json:"decimals"`

		// DEPRECATED: Token amount as a float, accounting for decimals.
		UiAmount *float64 `json:"uiAmount"`

		// Token amount as a string, accounting for decimals.
		UiAmountString string `json:"uiAmountString"`
	} `json:"value"`
}

func (s *Provider) GetTokenSupply(mint solana.PublicKey, commitment string) (*GetTokenSupplyResult, error) {
	params := []interface{}{}

	if commitment != "" {
		params = append(params, map[string]string{
			"commitment": commitment,
		})
	}

	res, err := s.RawInvoke("getTokenSupply", params)

	if err != nil {
		return nil, fmt.Errorf(
			"failed to getTokenSupply: %v",
			err,
		)
	}

	var tokenSupplyResult GetTokenSupplyResult

	if err := json.Unmarshal(res, &tokenSupplyResult); err != nil {
		return nil, fmt.Errorf(
			"failed to decode getTokenSupply, message %#v: %v",
			string(res),
			err,
		)
	}

	return &tokenSupplyResult, nil
}
