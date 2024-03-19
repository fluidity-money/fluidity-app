package main

import (
	"fmt"
	"strings"

	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/queue"
	"github.com/fluidity-money/fluidity-app/lib/queues/worker"
	"github.com/fluidity-money/fluidity-app/lib/types/applications"
	worker_types "github.com/fluidity-money/fluidity-app/lib/types/worker"
)

const (
	FluidityModule = `fluidity_coin`
	PayoutFunction = `distribute_yield`
)

type payoutArgs struct {
	PrizePoolVault string
	ScallopVersion string
	ScallopMarket  string
	Clock          string
}

func sendEmission(emission *worker.Emission) {
	emission.Update()

	queue.SendMessage(worker.TopicEmissions, emission)

	log.Debugf("Emission: %s", emission)
}

// formatPayouts takes a map of utility => payout and returns a string
// representation of the payouts for logging
func formatPayouts(payouts map[applications.UtilityName]worker_types.Payout) string {
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
