// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package curve

import (
	"strings"

	ethAbi "github.com/ethereum/go-ethereum/accounts/abi"
)

func init() {
	reader := strings.NewReader(curveAbiString)

	var err error

	if curveAbi, err = ethAbi.JSON(reader); err != nil {
		panic(err)
	}
}
