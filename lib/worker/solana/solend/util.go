package solend

import "math/big"

func bigPowInt32(left *big.Rat, count int32) *big.Rat {

	leftCopy_ := *left
	leftCopy := &leftCopy_

	leftOriginal_ := *left
	leftOriginal := &leftOriginal_

	var i int32

	for i = 1; i < count; i++ {
		leftCopy = new(big.Rat).Mul(leftCopy, leftOriginal)
	}

	return leftCopy
}
