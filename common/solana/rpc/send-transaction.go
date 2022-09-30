// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package rpc

import (
	"encoding/base64"
	"encoding/json"
	"fmt"

	"github.com/fluidity-money/fluidity-app/common/solana"
)

func (s *Provider) SendTransaction(transaction *solana.Transaction) (sig solana.Signature, err error) {
	txData, err := transaction.MarshalBinary()

	if err != nil {
		return solana.Signature{}, fmt.Errorf(
			"send transaction: encode transaction: %w",
			err,
		)
	}

	obj := map[string]string{
		"encoding": "base64",
	}

	params := []interface{}{
		base64.StdEncoding.EncodeToString(txData),
		obj,
	}

	invocation, err := s.RawInvoke("sendTransaction", params)

	if err != nil {
		return sig, fmt.Errorf(
			"failed to sendTransaction: %v",
			err,
		)
	}

	err = json.Unmarshal(invocation, &sig)

	if err != nil {
		return solana.Signature{}, fmt.Errorf(
			"failed to sendTransaction: %v, %v",
			err,
			invocation,
		)
	}

	return sig, nil
}
