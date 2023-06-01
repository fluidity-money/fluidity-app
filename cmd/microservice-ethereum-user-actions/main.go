// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package main

import (
	"fmt"
	"runtime/debug"
)

const (
	// EnvFilterAddress to use to find events published by this contract
	EnvFilterAddress = `FLU_ETHEREUM_CONTRACT_ADDR`

	// EnvTokenShortName to use when identifying user actions tracked using
	// this microservice
	EnvTokenShortName = `FLU_ETHEREUM_TOKEN_NAME`

	// EnvTokenDecimals to use when sharing user actions made with this token
	// to any downstream consumers who might make a conversion to a float for
	// user representation
	EnvTokenDecimals = `FLU_ETHEREUM_TOKEN_DECIMALS`

	// EnvNetwork to track (ethereum or arbitrum) in this microservice
	EnvNetwork = `FLU_ETHEREUM_NETWORK`
)

func main() {
	buildInfo, _ := debug.ReadBuildInfo()
	panic(fmt.Sprintf("%v", buildInfo))
}
