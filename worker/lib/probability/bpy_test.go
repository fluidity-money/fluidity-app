package probability

import (
	"math/big"
	"testing"

	"github.com/fluidity-money/fluidity-app/lib/log/breadcrumb"
	"github.com/stretchr/testify/assert"
)

func TestCalculateBpy(t *testing.T) {
	var (
		blockTime     = 15
		compSupplyApy = big.NewRat(100, 10)
		c             = breadcrumb.NewBreadcrumb()
		// (15 * 10) / 31536000 = 0.00005 = 1/210240
		expected = big.NewRat(1, 210240)
	)

	result := CalculateBpy(uint64(blockTime), compSupplyApy, c)
	assert.Equal(t, expected, result)
}

func TestCalculateBpyStakedUnderlyingAsset(t *testing.T) {
	var (
		bpy           = big.NewRat(12, 1)
		sizeOfThePool = big.NewRat(120, 1)
		// (12*120)/100 = 144/10 = 72/5
		expected = big.NewRat(72, 5)
	)

	result := CalculateBpyStakedUnderlyingAsset(bpy, sizeOfThePool)
	assert.Equal(t, expected, result)
}
