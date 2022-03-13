package solend

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestToInt(t *testing.T) {
	var (
		d = Decimal{
			One: uint64(10),
			Two: uint64(10),
		}
		// b(two) 64 padded b(one)
		expectedString = "10100000000000000000000000000000000000000000000000000000000000001010"
		dBinary        = d.ToInt().Text(2)
	)

	assert.Equal(t, expectedString, dBinary)
}
