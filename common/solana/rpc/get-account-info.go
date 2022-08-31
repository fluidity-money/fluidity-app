// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package rpc

import (
	"encoding/json"
	"fmt"

	"github.com/fluidity-money/fluidity-app/common/solana"
	types "github.com/fluidity-money/fluidity-app/lib/types/solana"
)

type accountResponse struct {
	Value types.Account `json:"value"`
}

func (s Provider) GetAccountInfo(account_ solana.PublicKey) (*types.Account, error) {
	publicKey := account_.ToBase58()

	res, err := s.RawInvoke("getAccountInfo", []interface{}{
		publicKey,
		map[string]string{
			"encoding": "base64",
		},
	})

	if err != nil {
		return nil, fmt.Errorf(
			"failed to getAccountInfo: %v",
			err,
		)
	}

	var accountResponse accountResponse

	if err := json.Unmarshal(res, &accountResponse); err != nil {
		return nil, fmt.Errorf(
			"failed to decode getAccountInfo, message %#v: %v",
			string(res),
			err,
		)
	}

	account := accountResponse.Value

	return &account, nil
}
