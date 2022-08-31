// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package payout

import "github.com/fluidity-money/fluidity-app/lib/types/misc"

type (
	// UtilityGaugePower is the internal type of UtilityGauges
	UtilityGaugePower struct {
		Chain   string
		Network string
		Gauge   string

		Epoch      uint32
		Disabled   bool
		TotalPower misc.BigInt
	}

	// EpochGauges is the list of approved gauges to derive EpochGauge
	EpochGauges struct {
		Gaugemeister string
		Epoch        uint32
		Gauges       []string
	}
)
