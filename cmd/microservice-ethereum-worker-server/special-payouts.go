// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package main

import (
	"math/big"

	"github.com/fluidity-money/fluidity-app/common/calculation/probability"

	workerDb "github.com/fluidity-money/fluidity-app/lib/databases/postgres/worker"
	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/queues/worker"
	"github.com/fluidity-money/fluidity-app/lib/types/network"
	workerTypes "github.com/fluidity-money/fluidity-app/lib/types/worker"
	"github.com/fluidity-money/fluidity-app/lib/util"
)

func calculateSpecialPayoutDetails(dbNetwork network.BlockchainNetwork, pool workerTypes.UtilityVars, transferFeeNormal, currentAtx, payoutFreq *big.Rat, winningClasses, btx int, epochTime uint64, emission *worker.Emission) PayoutDetails {
	calculationType := pool.CalculationType

	switch calculationType {
	case workerTypes.CalculationTypeWorkerOverrides:
		var (
			// defaults
			winningClasses = winningClasses
			payoutFreq     = payoutFreq

			zeroRat = big.NewRat(0, 1)
		)

		// get overrides
		details, found := workerDb.GetSpecialPoolOverrides(dbNetwork, pool.Name)

		if found {
			var (
				winningClassesOverride = details.WinningClassesOverride
				payoutFreqOverride     = details.PayoutFreqOverride
				deltaWeightOverride    = details.DeltaWeightOverride
			)

			if winningClassesOverride != 0 {
				winningClasses = winningClassesOverride
				emission.SpecialPoolOptions.WinningClassesOverride = float64(winningClasses)
			}

			if payoutFreqOverride != nil && payoutFreqOverride.Cmp(zeroRat) != 0 {
				payoutFreq.Set(payoutFreqOverride)
				emission.SpecialPoolOptions.PayoutFreqOverride, _ = payoutFreqOverride.Float64()
			}

			if deltaWeightOverride != nil && deltaWeightOverride.Cmp(zeroRat) != 0 {
				// this overrides a pool variable !!
				pool.DeltaWeight.Set(deltaWeightOverride)
				emission.SpecialPoolOptions.DeltaWeightOverride, _ = deltaWeightOverride.Float64()
			}
		}

		// call the trf normally now
		specialPayout := calculatePayoutDetails(
			workerTypes.TrfModeNoOptimisticSolution,
			transferFeeNormal,
			currentAtx,
			payoutFreq,
			[]workerTypes.UtilityVars{pool},
			winningClasses,
			btx,
			epochTime,
			emission,
		)

		specialPayout.customPayoutType = calculationType

		return specialPayout

	default:
		log.Fatal(func(k *log.Log) {
			k.Format(
				"Unhandled calculation type '%s'!",
				calculationType,
			)
		})

		panic("unreachable")
	}
}

// calculatePayoutDetails takes everything relevant to the trf and returns a list of payouts and balls
func calculatePayoutDetails(trfMode workerTypes.TrfMode, transferFeeNormal, currentAtx, payoutFreq *big.Rat, pools []workerTypes.UtilityVars, winningClasses, btx int, epochTime uint64, emission *worker.Emission) PayoutDetails {
	randomN, randomPayouts, _ := probability.WinningChances(
		trfMode,
		transferFeeNormal,
		currentAtx,
		payoutFreq,
		pools,
		winningClasses,
		btx,
		epochTime,
		emission,
	)

	randomSource := util.RandomIntegers(
		winningClasses,
		1,
		uint32(randomN),
	)

	payoutDetails := PayoutDetails{
		randomSource:  randomSource,
		randomPayouts: randomPayouts,
	}

	return payoutDetails
}