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

// calculateSpecialPayoutDetails by looking up the pool in the database
// for overrides (and whether it's enabled), if it's not set then we
// assume it's okay to continue, if the row exists, then we'll override
// it. if it's set but it's disabled, then we return an empty struct.
// logs the details via the emissions.
func calculateSpecialPayoutDetails(dbNetwork network.BlockchainNetwork, pool workerTypes.UtilityVars, transferFeeNormal, currentAtx, payoutFreq *big.Rat, winningClasses, btx int, epochTime uint64, emission *worker.Emission) (specialPayout PayoutDetails) {
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
		details, isEnabled, found := workerDb.GetSpecialPoolOverrides(dbNetwork, pool.Name)

		switch {
		case found && isEnabled:
			// if the pool is enabled, then we need to handle the worker override behaviour

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

		case found:
			// we found the pool, but it was disabled! so we're going to return an empty PayoutDetails!

			log.App(func(k *log.Log) {
				k.Format(
					"Found pool %v, but was not enabled! Returning nothing on this utility client!",
					pool.Name,
				)
			})

			return

		default:
			log.App(func(k *log.Log) {
				k.Format(
					"Didn't find %v in the database, assuming it's enabled and that we don't want to override it",
					pool.Name,
				)
			})
		}

		// call the trf normally now
		specialPayout = calculatePayoutDetails(
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
