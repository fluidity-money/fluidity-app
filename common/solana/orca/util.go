package orca

import "math/big"

func safeNewRat(x, y int64) *big.Rat {
	zero := big.NewRat(0, 1)

	if y == 0 {
		return zero
	}

	return big.NewRat(x, y)
}
