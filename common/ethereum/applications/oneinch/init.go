// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package oneinch

import (
	"strings"

	ethAbi "github.com/ethereum/go-ethereum/accounts/abi"
)

func init() {
	reader := strings.NewReader(oneInchLiquidityPoolV2AbiString)

	var err error

	if oneInchLiquidityPoolV2Abi, err = ethAbi.JSON(reader); err != nil {
		panic(err)
	}

	reader = strings.NewReader(fixedRateSwapAbiString)

	if fixedRateSwapAbi, err = ethAbi.JSON(reader); err != nil {
		panic(err)
	}

	reader = strings.NewReader(mooniswapPoolV1AbiString)

	if mooniswapPoolV1Abi, err = ethAbi.JSON(reader); err != nil {
		panic(err)
	}
}
