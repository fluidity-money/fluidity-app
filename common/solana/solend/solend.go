// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package solend

import (
	"fmt"
	"math/big"
)

type (
	Decimal struct {
		One uint64
		Two uint64
	}
)

func (d Decimal) ToInt() *big.Int {
	byteString := fmt.Sprintf("%b%064b", d.Two, d.One)
	newInt := new(big.Int)
	newInt.SetString(byteString, 2)
	return newInt
}
