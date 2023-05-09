// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package main

import (
	"math"
	"math/big"
)

func pow10(x int) *big.Rat {
	return new(big.Rat).SetFloat64(math.Pow10(x))
}
