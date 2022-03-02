package beta

// faucet contains a collections of functions to update the faucet field
// for beta users.

import (
	"database/sql"
	"fmt"
	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/postgres"
	"time"
)

// GetFaucetTimestamp using the user's user_id
func GetFaucetTimestamp(userId string) *time.Time {
	databaseClient := postgres.Client()

	statementText := fmt.Sprintf(
		`SELECT faucet_timestamp

		FROM %s
		WHERE user_id = $1
		`,

		TableBetaUsers,
	)

	resultRow := databaseClient.QueryRow(
		statementText,
		userId,
	)

	var resultTime time.Time

	err := resultRow.Scan(&resultTime)

	if err == sql.ErrNoRows {
		return nil
	}

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Context = Context
			k.Message = "Failed to query faucet use logs!"
			k.Payload = err
		})
	}

	return &resultTime
}

// UpdateFaucetTimestamp with the current time for a user_id
func UpdateFaucetTimestamp(userId string) {
	postgresClient := postgres.Client()

	query := fmt.Sprintf(
		`UPDATE %s
		SET faucet_timestamp = CURRENT_TIMESTAMP

		WHERE user_id = $1`,

		TableBetaUsers,
	)

	_, err := postgresClient.Exec(query, userId)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Message = "Failed to insert a faucet log!"
			k.Payload = err
		})
	}
}
