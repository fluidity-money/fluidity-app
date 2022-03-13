package pyth

import (
	"math/big"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestDebug(t *testing.T) {
	debug("format string %v", 123)
}

func TestBigPowInt32(t *testing.T) {
	// 5 ^ 3 = 125
	expected := big.NewRat(125, 1)
	result := bigPowInt32(big.NewRat(5, 1), 3)

	// 2 ^ 1 = 2
	expected = big.NewRat(2, 1)
	result = bigPowInt32(big.NewRat(2, 1), 1)
	assert.Equal(t, expected, result)

	// -1/2 ^ 2 = 1/4
	expected = big.NewRat(1, 4)
	result = bigPowInt32(big.NewRat(-1, 2), 2)
	assert.Equal(t, expected, result)

	// 25^0 = 1
	expected = big.NewRat(1, 1)
	result = bigPowInt32(big.NewRat(25, 1), 0)
	assert.Equal(t, expected, result)

	// 2 ^ -1 = 1/2
	expected = big.NewRat(1, 2)
	result = bigPowInt32(big.NewRat(2, 1), -1)
	assert.Equal(t, expected, result)

	// 2 ^ -3 = 1/8
	expected = big.NewRat(1, 8)
	result = bigPowInt32(big.NewRat(2, 1), -3)
	assert.Equal(t, expected, result)

	// 0 ^ -1 = undefined (panic)
	assert.PanicsWithValue(t, "division by zero", func() {
		bigPowInt32(big.NewRat(0, 1), -1)
	})
}
