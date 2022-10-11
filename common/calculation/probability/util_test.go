// Copyright 2022 Fluidity Money. All rights reserved. Use of this source
// code is governed by a Creative Commons license that can be found in the
// LICENSE_TRF.md file.

package probability

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestIntRatConversion(t *testing.T) {
	x := 1579

	xIntToRat := intToRat(x)
	rIntToRat := xIntToRat.Num().Int64()
	assert.EqualValues(t, x, rIntToRat)

	xInt64ToRat := ratFromInt64(rIntToRat)
	rInt64ToRat := xInt64ToRat.Num().Int64()
	assert.EqualValues(t, x, rInt64ToRat)

	xUint64ToRat := uint64ToRat(uint64(x))
	rUint64ToRat := xUint64ToRat.Num().Int64()
	assert.EqualValues(t, x, rUint64ToRat)
}
