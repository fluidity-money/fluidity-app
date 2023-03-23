// Copyright 2022 Fluidity Money. All rights reserved. Use of this source
// code is governed by a Creative Commons license that can be found in the
// LICENSE_TRF.md file.

package probability

import (
	"math/big"
	"testing"

	"github.com/stretchr/testify/assert"
)

func rat(num int64) *big.Rat {
	return new(big.Rat).SetInt64(num)
}

func TestCalculateAtx(t *testing.T) {
	// zero cases
	result := CalculateAtx(rat(10), 0)

	expectedZero := big.NewRat(0, 1)
	assert.Equal(t, 0, result.Cmp(expectedZero))

	result = CalculateAtx(rat(0), 0)
	assert.Equal(t, 0, result.Cmp(expectedZero))

	result = CalculateAtx(rat(0), 2)
	assert.Equal(t, 0, result.Cmp(expectedZero))

	// negative
	result = CalculateAtx(rat(1), -1)
	assert.Equal(t, 0, result.Cmp(expectedZero))

	// blocks per year * no of transfers in a block

	// one transfer in one block
	secondsInAYear := int64(31536000)
	result = CalculateAtx(rat(secondsInAYear), 1)
	expected := big.NewRat(1, 1)
	assert.Equal(t, expected, result)

	// one transfer in two blocks
	result = CalculateAtx(rat(secondsInAYear/2), 1)
	expected = big.NewRat(2, 1)
	assert.Equal(t, expected, result)

	// 8 transfers in two blocks
	result = CalculateAtx(rat(secondsInAYear/2), 8)
	expected = big.NewRat(16, 1)
	assert.Equal(t, expected, result)
}
