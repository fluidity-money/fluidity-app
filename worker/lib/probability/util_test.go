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

func TestDebug(t *testing.T) {
	debug("format string %v", 123)
}
