package beta

import (
	"github.com/fluidity-money/fluidity-app/lib/timescale"
	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/types/beta"
	"fmt"
)

type BetaWinningTransaction = beta.BetaWinningTransaction

func InsertWinningTransaction(winningTransaction BetaWinningTransaction) {
	var (
		transactionHash = winningTransaction.TransactionHash
		fromAddress     = winningTransaction.FromAddress
		toAddress = winningTransaction.ToAddress
		contractCall = winningTransaction.ContractCall
		receiverWinAmount = winningTransaction.ReceiverWinAmount
		senderWinAmount = winningTransaction.SenderWinAmount
	)

	databaseClient := timescale.Client()

	statementText := fmt.Sprintf(
		`INSERT INTO %s (
			transaction_hash,
			from_address,
			to_address,
			contract_call,
			receiver_win_amount,
			sender_win_amount
		)

		VALUES
			$1,
			$2,
			$3,
			$4,
			$5,
			$6;
		`,

		TableBetaWinningTransactions,
	)

	_, err := databaseClient.Exec(
		statementText,
		transactionHash,
		fromAddress,
		toAddress,
		contractCall,
		receiverWinAmount,
		senderWinAmount,
	)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Context = Context
			k.Message = "Failed to insert a beta winning transaction!"
			k.Payload = err
		})
	}
}
