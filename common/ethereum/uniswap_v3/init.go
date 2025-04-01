// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package uniswap_v3

import (
	"bytes"

	ethAbi "github.com/ethereum/go-ethereum/accounts/abi"
)

func init() {
	uniswapV3PoolReader := bytes.NewBuffer(uniswapV3AbiBytes)

	var err error

	if uniswapV3PoolAbi, err = ethAbi.JSON(uniswapV3PoolReader); err != nil {
		panic(err)
	}
}
