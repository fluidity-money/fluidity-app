package pyth

import "math/big"

func bigPowInt32(left *big.Rat, count int32) *big.Rat {

	if count == 0 {
		return big.NewRat(1, 1)
	}

	leftCopy_ := *left
	leftCopy := &leftCopy_

	leftOriginal_ := *left
	leftOriginal := &leftOriginal_

	var i int32

	if count > 0 {
		for i = 1; i < count; i++ {
			leftCopy = new(big.Rat).Mul(leftCopy, leftOriginal)
		}
	} else {
		for i = -1; i > count; i-- {
			leftCopy = new(big.Rat).Mul(leftCopy, leftOriginal)
		}

		leftCopy.Inv(leftCopy)
	}

	return leftCopy
}
