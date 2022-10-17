package ethereum

import (
	"math/big"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestCalculateEffectiveGasPrice(t *testing.T) {
	gasPrice := CalculateEffectiveGasPrice(
		new(big.Rat).SetInt64(22_083_465_824), // base fee per gas
		new(big.Rat).SetInt64(40_335_372_944), // max fee per gas
		new(big.Rat).SetInt64(269_305_772), // max priority fee per gas
	)

	testGasPrice := new(big.Rat).SetInt64(22_352_771_596)

	assert.Equal(t, testGasPrice, gasPrice, "effectiveGasPrice calculation")
}
