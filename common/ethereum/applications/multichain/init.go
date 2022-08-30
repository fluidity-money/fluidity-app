// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package multichain

import (
	"strings"

	ethAbi "github.com/ethereum/go-ethereum/accounts/abi"
)

func init() {
	reader := strings.NewReader(multichainAbiString)

	var err error

	if multichainAbi, err = ethAbi.JSON(reader); err != nil {
		panic(err)
	}

	reader = strings.NewReader(anyswapERC20AbiString)

	if anyswapERC20Abi, err = ethAbi.JSON(reader); err != nil {
		panic(err)
	}
}
