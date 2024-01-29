// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package camelot

import (
	"strings"

	ethAbi "github.com/ethereum/go-ethereum/accounts/abi"
)

func init() {
	reader := strings.NewReader(camelotPairAbiString)

	var err error

	if camelotPairAbi, err = ethAbi.JSON(reader); err != nil {
		panic(err)
	}

	reader = strings.NewReader(camelotV3AbiString)

	if camelotV3Abi, err = ethAbi.JSON(reader); err != nil {
		panic(err)
	}
}
