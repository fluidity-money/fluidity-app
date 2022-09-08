package aave

import "math/big"

func safeQuo(x, y *big.Rat) *big.Rat {
	zero := big.NewRat(0, 1)

	if y.Cmp(zero) == 0 {
		return zero
	}

	return new(big.Rat).Quo(x, y)
}
