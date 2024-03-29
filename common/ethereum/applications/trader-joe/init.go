// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package trader_joe

import (
	"strings"

	ethAbi "github.com/ethereum/go-ethereum/accounts/abi"
)

func init() {
	reader := strings.NewReader(traderJoeSwapAbiString)

	var err error

	if traderJoeSwapAbi, err = ethAbi.JSON(reader); err != nil {
		panic(err)
	}

	reader = strings.NewReader(traderJoeLBPairAbiString)

	if traderJoeLBPairAbi, err = ethAbi.JSON(reader); err != nil {
		panic(err)
	}
}
