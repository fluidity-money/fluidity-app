package main

import (
	"fmt"
	"strings"

	"github.com/fluidity-money/fluidity-app/lib/types/applications"
	"github.com/fluidity-money/fluidity-app/lib/types/worker"
)

// formatPayouts takes a map of utility => payout and returns a string
// representation of the payouts for logging
func formatPayouts(payouts map[applications.UtilityName]worker.Payout) string {
	payoutsStrings := make([]string, len(payouts))

	i := 0
	for utility, payout := range payouts {
		var (
			native = payout.Native
			usd    = payout.Usd
		)

		payoutsStrings[i] = fmt.Sprintf("%s: %s tokens, %f USD", utility, native.String(), usd)

		i++
	}

	payoutsString := strings.Join(payoutsStrings, ", ")

	return payoutsString
}
