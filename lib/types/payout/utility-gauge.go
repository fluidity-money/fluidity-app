package payout

import "github.com/fluidity-money/fluidity-app/lib/types/misc"

type UtilityGaugePower struct {
	Network  string
	Protocol misc.Blob
	Epoch    uint32

	TotalPower misc.BigInt
}
