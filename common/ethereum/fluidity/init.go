// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package fluidity

import (
	"strings"

	ethAbi "github.com/ethereum/go-ethereum/accounts/abi"
)

func ethAbiMustArgument(name, typ string) ethAbi.Argument {
	ethType, err := ethAbi.NewType(typ, typ, nil)

	if err != nil {
		panic(err)
	}

	arg := ethAbi.Argument{
		Name: name,
		Type: ethType,
	}

	return arg
}

func init() {
	reader := strings.NewReader(fluidityContractAbiString)

	var err error

	if FluidityContractAbi, err = ethAbi.JSON(reader); err != nil {
		panic(err)
	}

	reader = strings.NewReader(workerConfigAbiString)

	if WorkerConfigAbi, err = ethAbi.JSON(reader); err != nil {
		panic(err)
	}
}
