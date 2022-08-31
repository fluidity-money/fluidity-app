// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package balancer

import (
	"strings"

	ethAbi "github.com/ethereum/go-ethereum/accounts/abi"
)

func init() {
	reader := strings.NewReader(balancerV2VaultAbiString)

	var err error

	if balancerV2VaultAbi, err = ethAbi.JSON(reader); err != nil {
		panic(err)
	}

	reader = strings.NewReader(balancerV2PoolAbiString)

	if balancerV2PoolAbi, err = ethAbi.JSON(reader); err != nil {
		panic(err)
	}
}
