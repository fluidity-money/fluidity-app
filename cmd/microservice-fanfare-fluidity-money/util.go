// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package main

import (
	"math"
	"math/big"
	"strings"
)

func pow10(x int) *big.Rat {
	return new(big.Rat).SetFloat64(math.Pow10(x))
}

func cleanAddress(x string) string {
	return strings.ToLower(x)
}
