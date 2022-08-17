package solana

import (
	"fmt"

	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/postgres"
	"github.com/fluidity-money/fluidity-app/lib/types/misc"
)

func GetUserMintLimit(address string) misc.BigInt {
	databaseClient := postgres.Client()

	statementText := fmt.Sprintf(
		`SELECT amount_minted
		FROM %s
		WHERE address = $1`,

		TableUsers,
	)

	row := databaseClient.QueryRow(statementText, address)

	if err := row.Err(); err != nil {
		log.Fatal(func(k *log.Log) {
			k.Context = Context

			k.Format(
				"Failed to query the Solana user (%#v) mint limit!",
				address,
			)

			k.Payload = err
		})
	}

	var amount misc.BigInt

	if err := row.Scan(&amount); err != nil {
		log.Fatal(func(k *log.Log) {
			k.Context = Context

			k.Format(
				"Failed to scan the mint amount for a user address (%#v)",
				address,
			)

			k.Payload = err
		})
	}

	return amount
}

func ReduceMintUserLimit(address string, amount misc.BigInt) {
	databaseClient := postgres.Client()

	statementText := fmt.Sprintf(
		`UPDATE %s
		SET amount_minted = amount_minted - $1
		WHERE address = $2`,

		TableUsers,
	)

	_, err := databaseClient.Exec(statementText, amount, address)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Context = Context

			k.Format(
				"Failed to reduce the Solana user (%#v) mint limit by %v!",
				address,
				amount,
			)

			k.Payload = err
		})
	}
}

func AddMintUserLimit(address string, amount misc.BigInt) {
	databaseClient := postgres.Client()

	statementText := fmt.Sprintf(
		`UPDATE %s
		SET amount_minted = amount_minted + $1
		WHERE address = $2`,

		TableUsers,
	)

	_, err := databaseClient.Exec(statementText, amount, address)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Context = Context

			k.Format(
				"Failed to add the Solana user (%#v) mint limit by %v!",
				address,
				amount,
			)

			k.Payload = err
		})
	}
}
