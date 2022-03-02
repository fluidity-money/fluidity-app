package probability

import (
	"math/big"

	"github.com/fluidity-money/fluidity-app/lib/log/breadcrumb"
)

func CalculateBpy(blockTimeInSeconds uint64, compSupplyApy *big.Rat, crumb *breadcrumb.Breadcrumb) *big.Rat {
	blockTimeInSeconds_ := uint64ToRat(blockTimeInSeconds)

	multiplied := blockTimeInSeconds_.Mul(blockTimeInSeconds_, compSupplyApy)

	crumb.Set(func(k *breadcrumb.Breadcrumb) {
		k.Many(map[string]interface{}{
			"block time in seconds": blockTimeInSeconds,
			"comp supply apy":       compSupplyApy.FloatString(10),

			"block time in seconds multiplied by comp supply apy": multiplied.FloatString(10),
		})
	})

	bpy := multiplied.Quo(multiplied, big.NewRat(31536000, 1))

	return bpy
}

func CalculateBpyStakedUnderlyingAsset(bpy, sizeOfThePool *big.Rat) *big.Rat {
	stakedUsd := new(big.Rat).Mul(bpy, sizeOfThePool)

	bpyStakedUsd := new(big.Rat).Quo(stakedUsd, big.NewRat(100, 1))

	return bpyStakedUsd
}
