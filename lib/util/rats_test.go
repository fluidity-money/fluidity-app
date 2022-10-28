package util

import (
	"fmt"
	"math/big"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestMaybeRatToFloat(t *testing.T) {
	var (
		half   = big.NewRat(1, 2)
		halfExpected = 0.5

		none   *big.Rat = nil
		noneExpected = float64(0)
	)

	halfResult := MaybeRatToFloat(half)
	assert.Equal(t, halfExpected, halfResult,
		fmt.Sprintf(
			"MaybeRatToFloat(%v) = %v, want match for %#v!",
			half,
			halfResult,
			halfExpected,
		),
	)

	noneResult := MaybeRatToFloat(none)
	assert.Equal(t, noneExpected, noneResult,
		fmt.Sprintf(
			"MaybeRatToFloat(%v) = %v, want match for %#v!",
			none,
			noneResult,
			noneExpected,
		),
	)
}
