package util

import "math/big"

// converts a big.Rat to a float, returning 0 if the rat is nil
func MaybeRatToFloat(rat *big.Rat) float64 {
	if rat == nil {
		return 0
	}

	num, _ := rat.Float64()

	return num
}
