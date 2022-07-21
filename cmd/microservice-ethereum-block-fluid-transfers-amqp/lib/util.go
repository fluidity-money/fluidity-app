// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE file.

package microservice_ethereum_block_fluid_transfers_amqp

import (
	"fmt"

	"github.com/ethereum/go-ethereum/common/hexutil"

	"github.com/fluidity-money/fluidity-app/lib/types/misc"
)

func bigIntFromPossiblyHex(s string) (*misc.BigInt, error) {
	int, err := hexutil.DecodeBig(s)

	if err != nil {
		return nil, fmt.Errorf(
			"failed to decode a bigint from possibly hex: %v",
			err,
		)
	}

	bigInt := misc.NewBigInt(*int)

	return &bigInt, nil
}
