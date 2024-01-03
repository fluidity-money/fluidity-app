// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package jumper

import (
	"strings"

	ethAbi "github.com/ethereum/go-ethereum/accounts/abi"
)

func init() {
	reader := strings.NewReader(jumperSwapAbiAbiStr)

	var err error

	if jumperSwapAbi, err = ethAbi.JSON(reader); err != nil {
		panic(err)
	}

	reader = strings.NewReader(jumperSwapAbiStr)

	if jumperSwapAbiStr, err = ethAbi.JSON(reader); err != nil {
		panic(err)
	}
}
