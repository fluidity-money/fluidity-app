// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package rpc

import (
	"encoding/json"
	"fmt"

	"github.com/fluidity-money/fluidity-app/common/solana"
)

type GetTokenAccountBalanceResult struct {
	RpcContext

	Value *struct {
		// Raw balance of tokens as a string, ignoring decimals.
		Amount string `json:"amount"`

		// Number of decimals configured for token's mint.
		Decimals uint8 `json:"decimals"`

		// TODO: <number> == int64 ???
		// DEPRECATED: Token amount as a float, accounting for decimals.
		UiAmount *float64 `json:"uiAmount"`

		// Token amount as a string, accounting for decimals.
		UiAmountString string `json:"uiAmountString"`
	} `json:"value"`
}

func (s *Provider) GetTokenAccountBalance(pda solana.PublicKey, commitment string) (*GetTokenAccountBalanceResult, error) {
	params := []interface{}{
		pda.String(),
	}

	if commitment != "" {
		params = append(params, map[string]string{
			"commitment": commitment,
		})
	}

	res, err := s.RawInvoke("getTokenAccountBalance", params)

	if err != nil {
		return nil, fmt.Errorf(
			"failed to getTokenAccountBalance: %v",
			err,
		)
	}

	var tokenBalanceResult GetTokenAccountBalanceResult

	if err := json.Unmarshal(res, &tokenBalanceResult); err != nil {
		return nil, fmt.Errorf(
			"failed to decode getTokenAccountBalance, message %#v: %v",
			string(res),
			err,
		)
	}

	return &tokenBalanceResult, nil
}
