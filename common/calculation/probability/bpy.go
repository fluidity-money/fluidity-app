package probability

import (
	"math/big"

	"github.com/fluidity-money/fluidity-app/lib/types/worker"
)

func CalculateBpy(blockTimeInSeconds uint64, compSupplyApy *big.Rat, emission *worker.Emission) *big.Rat {
	blockTimeInSeconds_ := uint64ToRat(blockTimeInSeconds)

	multiplied := blockTimeInSeconds_.Mul(blockTimeInSeconds_, compSupplyApy)

	emission.CalculateBpy.BlockTimeInSeconds = blockTimeInSeconds
	emission.CalculateBpy.CompSupplyApy, _ = compSupplyApy.Float64()
	emission.CalculateBpy.BlockTimeInSecondsMultipliedByCompSupplyApy, _ = multiplied.Float64()

	bpy := multiplied.Quo(multiplied, big.NewRat(31536000, 1))

	return bpy
}
