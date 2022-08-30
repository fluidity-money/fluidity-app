// Copyright 2022 Fluidity Money. All rights reserved. Use of this source
// code is governed by a commercial license that can be found in the
// LICENSE_TRF.md file.

package probability

// atx calculates the ATX that we see in the current TRF version

import (
	"math/big"
)

// CalculateAtx using the duration since the last block and the number of
// fluid transfers
func CalculateAtx(secondsSinceLastBlock uint64, fluidTransfers int) *big.Rat {

	// set to zero if negative, or either value is zero
	if fluidTransfers <= 0 || secondsSinceLastBlock == 0 {
		// zero type here is zero
		return new(big.Rat)
	}

	var (
		fluidTransfers_        = intToRat(fluidTransfers)
		secondsSinceLastBlock_ = uint64ToRat(secondsSinceLastBlock)
	)

	tSFTimesTF := new(big.Rat).Mul(big.NewRat(365, 1), big.NewRat(24, 1))

	tSFTimesTFTimesS := new(big.Rat).Mul(tSFTimesTF, big.NewRat(60, 1))

	STimesS := new(big.Rat).Mul(tSFTimesTFTimesS, big.NewRat(60, 1))

	fluidTransfersTimes := new(big.Rat).Mul(STimesS, fluidTransfers_)

	fluidTransfersMulSeconds := new(big.Rat).Quo(fluidTransfersTimes, secondsSinceLastBlock_)

	return fluidTransfersMulSeconds
}
