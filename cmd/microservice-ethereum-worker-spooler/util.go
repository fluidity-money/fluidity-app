// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package main

import (
	"math/big"

	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/util"
)

// read a big.Rat that must exist from the environment
func ratFromEnvOrFatal(env string) *big.Rat {
	resString := util.GetEnvOrFatal(env)

	res := new(big.Rat)

	_, success := res.SetString(resString)

	if !success {
		log.Fatal(func(k *log.Log) {
			k.Format(
				"Failed to parse %s as a rat reading env %s!",
				resString,
				env,
			)
		})
	}

	return res
}

// calculates 10^x as a bigint (for token decimals)
func bigExp10(val int64) *big.Int {
	res := new(big.Int)

	ten := big.NewInt(10)

	exp := big.NewInt(val)

	res.Exp(ten, exp, nil)

	return res
}

