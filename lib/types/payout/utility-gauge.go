package payout

import "github.com/fluidity-money/fluidity-app/lib/types/misc"

type (
	UtilityGaugePower struct {
		Chain   string
		Network string
		Gauge   string

		Epoch      uint32
		Disabled   bool
		TotalPower misc.BigInt
	}

	EpochGauges struct {
		Gaugemeister string
		Epoch        uint32
		Gauges       []string
	}
)
