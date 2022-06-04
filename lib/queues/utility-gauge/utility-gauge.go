package utility_gauge

import (
	"github.com/fluidity-money/fluidity-app/lib/queue"
	utilityGauge "github.com/fluidity-money/fluidity-app/lib/types/payout"
)

const TopicUtilityGauges = `utility_gauge.utility_gauges`

type EpochGauges = utilityGauge.EpochGauges

func GetEpochGauges(f func(EpochGauges)) {
	queue.GetMessages(TopicUtilityGauges, func(message queue.Message) {
		var epochGauges EpochGauges

		message.Decode(&epochGauges)

		f(epochGauges)
	})
}
