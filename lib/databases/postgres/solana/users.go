package solana

import (
	"database/sql"
	"fmt"

	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/postgres"
)

func GetUserMintLimit(address string) float64 {
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

	var amount float64

	err := row.Scan(&amount)

	if err == sql.ErrNoRows {
		return 0
	}

	if err != nil {
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

func ReduceMintUserLimit(address string, amount float64) {
	databaseClient := postgres.Client()

	statementText := fmt.Sprintf(
		`INSERT INTO %s (
			address,
			amount_minted,
			last_updated
		)

		VALUES (
			$1,
			0,
			NOW()
		)

		ON CONFLICT (address)
		DO UPDATE SET amount_minted = solana_users.amount_minted - $2;`,

		TableUsers,
	)

	_, err := databaseClient.Exec(
		statementText,
		address,
		amount,
	)

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

func AddMintUserLimit(address string, amount float64) {
	databaseClient := postgres.Client()

	statementText := fmt.Sprintf(
		`INSERT INTO %s (
			address,
			amount_minted,
			last_updated
		)

		VALUES (
			$1,
			$2,
			NOW()
		)

		ON CONFLICT (address)
		DO UPDATE SET amount_minted = solana_users.amount_minted + $2;`,

		TableUsers,
	)

	_, err := databaseClient.Exec(
		statementText,
		address,
		amount,
	)

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
