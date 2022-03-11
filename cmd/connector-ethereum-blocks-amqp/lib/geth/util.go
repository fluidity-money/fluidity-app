package geth

import "math/big"

func int64ToBigInt(x int64) big.Int {
	var int big.Int

	int.SetInt64(x)

	return int
}

func uint64ToBigInt(x uint64) big.Int {
	var int big.Int

	int.SetUint64(x)

	return int
}
