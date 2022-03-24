package probability

import (
	"math/big"

	"github.com/fluidity-money/fluidity-app/lib/types/worker"
)

func CalculateBpy(blockTimeInSeconds uint64, compSupplyApy *big.Rat, emission *worker.Emission) *big.Rat {
	blockTimeInSeconds_ := uint64ToRat(blockTimeInSeconds)

	multiplied := blockTimeInSeconds_.Mul(blockTimeInSeconds_, compSupplyApy)

	emission.CalculateBpy.BlockTimeInSeconds = blockTimeInSeconds
	emission.CalculateBpy.CompSupplyApy = compSupplyApy.FloatString(10)
	emission.CalculateBpy.BlockTimeInSecondsMultipliedByCompSupplyApy = multiplied.FloatString(10)

	bpy := multiplied.Quo(multiplied, big.NewRat(31536000, 1))

	return bpy
}

func CalculateBpyStakedUnderlyingAsset(bpy, sizeOfThePool *big.Rat) *big.Rat {
	stakedUsd := new(big.Rat).Mul(bpy, sizeOfThePool)

	bpyStakedUsd := new(big.Rat).Quo(stakedUsd, big.NewRat(100, 1))

	return bpyStakedUsd
}
