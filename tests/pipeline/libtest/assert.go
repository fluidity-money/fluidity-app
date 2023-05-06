package libtest

import (
	"math/big"
	"testing"

	"github.com/fluidity-money/fluidity-app/lib/types/misc"
	"github.com/stretchr/testify/assert"
)

var (
	zeroInt = big.NewInt(0)
)

func AssertNotZero(t *testing.T, num misc.BigInt, msg ...interface{}) {
	cmp := num.Cmp(zeroInt)
	assert.NotEqual(t, 0, cmp, msg...)
}
