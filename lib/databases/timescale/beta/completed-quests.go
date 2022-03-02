package beta

import (
	"fmt"
	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/timescale"
	"github.com/fluidity-money/fluidity-app/lib/types/beta"
)

type BetaCompletedQuest = beta.BetaCompletedQuest

// InsertCompletedQuest by a user, with their primary key, contract address
// and the time of completion
func InsertCompletedQuest(completedQuest BetaCompletedQuest) {
	var (
		betaUserUserId   = completedQuest.BetaUserUserId
		recipientAddress = completedQuest.RecipientAddress
		time             = completedQuest.Time
	)

	timescaleClient := timescale.Client()

	statementText := fmt.Sprintf(
		`INSERT INTO %s (
			beta_user_user_id,
			recipient_address,
			time
		)

		VALUES (
			$1,
			$2,
			$3
		)
		`,

		TableBetaCompletedQuests,
	)

	_, err := timescaleClient.Exec(
		statementText,
		betaUserUserId,
		recipientAddress,
		time,
	)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Context = Context
			k.Message = "Failed to insert a completed quest!"
			k.Payload = err
		})
	}
}
