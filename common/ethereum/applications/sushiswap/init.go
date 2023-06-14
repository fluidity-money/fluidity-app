// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package sushiswap

import (
	"strings"

	ethAbi "github.com/ethereum/go-ethereum/accounts/abi"
)

func init() {
	reader := strings.NewReader(sushiswapStablePoolAbiString)

	var err error

	if sushiswapStablePoolAbi, err = ethAbi.JSON(reader); err != nil {
		panic(err)
	}
}
