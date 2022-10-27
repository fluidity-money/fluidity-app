// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package chainlink

import (
	"strings"

	ethAbi "github.com/ethereum/go-ethereum/accounts/abi"
)

func init() {
	priceFeedReader := strings.NewReader(chainlinkPriceFeedAbiString)

	var err error

	if priceFeedAbi, err = ethAbi.JSON(priceFeedReader); err != nil {
		panic(err)
	}
}
