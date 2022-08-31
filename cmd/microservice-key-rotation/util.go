// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package main

import (
	"strings"

	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/util"
)

type OracleInfo struct {
	// contract address of the fluid token this oracle is for
	ContractAddress string
	// the AWS parameter key containing this oracle private key
	Parameter string
}

// oracleParametersListFromEnv to parse the AWS parameter names from the environment
func oracleParametersListFromEnv(env string) []OracleInfo {
	oracleParametersString := util.GetEnvOrFatal(EnvOracleParametersList)

	oracleParametersList_ := strings.Split(oracleParametersString, ",")
	numberOfTokens := len(oracleParametersList_)

	oracleParametersList := make([]OracleInfo, numberOfTokens)

	for i, oracle := range oracleParametersList_ {
		split := strings.Split(oracle, ":")

		if len(split) != 2 {
			log.Fatal(func(k *log.Log) {
				k.Format(
					"Failed to parse oracle from environment %v! Expected two parameters, had %v!",
					oracle,
					len(split),
				)
			})
		}

		var (
			contractAddress = split[0]
			parameter       = split[1]
		)

		oracleParametersList[i] = OracleInfo{
			ContractAddress: contractAddress,
			Parameter:       parameter,
		}
	}

	return oracleParametersList
}
