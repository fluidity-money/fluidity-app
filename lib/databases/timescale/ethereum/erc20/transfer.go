package erc20

import (
	"fmt"
	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/timescale"
	"github.com/fluidity-money/fluidity-app/lib/types/ethereum/erc20"
)

type Transfer = erc20.Transfer

// InsertTransfer into Timescale.
func InsertTransfer(transfer Transfer) {
	var (
		contractAddress = transfer.ContractAddress
		fromAddress     = transfer.FromAddress
		toAddress       = transfer.ToAddress
		amount          = transfer.Amount
		pickedUp        = transfer.PickedUp
		transactionHash = transfer.TransactionHash
	)

	timescaleClient := timescale.Client()

	statementText := fmt.Sprintf(
		`INSERT INTO %s (
			contract_address,
			from_address,
			to_address,
			amount,
			picked_up,
			transaction_hash
		)

		VALUES (
			$1,
			$2,
			$3,
			$4,
			$5,
			$6
		);
		`,

		TableTransfers,
	)

	_, err := timescaleClient.Exec(
		statementText,
		contractAddress,
		fromAddress,
		toAddress,
		amount,
		pickedUp,
		transactionHash,
	)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Context = Context
			k.Message = "Failed to insert an ERC20 transfer!"
			k.Payload = err
		})
	}
}
