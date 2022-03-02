package beta

import (
	"github.com/fluidity-money/fluidity-app/lib/timescale"
	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/types/beta"
	"fmt"
)

func InsertWinLog(winLog beta.BetaWinLog) {
	databaseClient := timescale.Client()

	statementText := fmt.Sprintf(
		`INSERT INTO %s (
			blockhash,
			tx_idx,
			win_amount
		)

		VALUES (
			$1,
			$2,
			$3
		);`,

		TableBetaWinLogs,
	)

	_, err := databaseClient.Exec(
		statementText,
		winLog.BlockHash,
		winLog.TransactionIndex,
		winLog.WinAmount,
	)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Context = Context
			k.Message = "Failed to insert a win log!"
			k.Payload = err
		})
	}
}
