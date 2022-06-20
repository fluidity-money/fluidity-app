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
