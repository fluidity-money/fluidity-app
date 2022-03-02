package beta

// beta contains user info for the fluidity beta tracking

import (
	"fmt"
	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/postgres"
	"github.com/fluidity-money/fluidity-app/lib/types/beta"
	"database/sql"
)

type BetaUser beta.BetaUser

// GetUsersWithUserId gets users with a matching user ID in the database.
func GetUsersWithUserId(userId string) []BetaUser {
	postgresClient := postgres.Client()

	statementText := fmt.Sprintf(
		`SELECT
			private_key,
			user_id,
			address,

			email,
			tickets_scored,

			daily_quest_timer,
			created,

			daily_quest_1_address,
			daily_quest_2_address,
			daily_quest_3_address,
			daily_quest_4_address,
			daily_quest_5_address,
			daily_quest_6_address,

			daily_quest_1_completed,
			daily_quest_2_completed,
			daily_quest_3_completed,
			daily_quest_4_completed,
			daily_quest_5_completed,
			daily_quest_6_completed,

			daily_streak,
			faucet_timestamp

		FROM %s
		WHERE user_id = $1
		`,

		TableBetaUsers,
	)

	resultRows, err := postgresClient.Query(
		statementText,
		userId,
	)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Context = Context

			k.Format(
				"Failed to query beta user rows for user id %#v!",
				userId,
			)

			k.Payload = err
		})
	}

	defer resultRows.Close()

	var betaUsers []BetaUser

	for resultRows.Next() {
		var betaUser BetaUser

		err := resultRows.Scan(
			&betaUser.PrivateKey,
			&betaUser.UserId,
			&betaUser.Address,
			&betaUser.Email,
			&betaUser.TicketsScored,
			&betaUser.DailyQuestTimer,
			&betaUser.Created,

			&betaUser.DailyQuest1Address,
			&betaUser.DailyQuest2Address,
			&betaUser.DailyQuest3Address,
			&betaUser.DailyQuest4Address,
			&betaUser.DailyQuest5Address,
			&betaUser.DailyQuest6Address,

			&betaUser.DailyQuest1Completed,
			&betaUser.DailyQuest2Completed,
			&betaUser.DailyQuest3Completed,
			&betaUser.DailyQuest4Completed,
			&betaUser.DailyQuest5Completed,
			&betaUser.DailyQuest6Completed,

			&betaUser.DailyStreak,
			&betaUser.FaucetTimestamp,
		)

		if err != nil {
			log.Fatal(func(k *log.Log) {
				k.Context = Context

				k.Format(
					"Failed to unwrap a user when filtering for unique id %#v!",
					userId,
				)

				k.Payload = err
			})
		}

		betaUsers = append(betaUsers, betaUser)
	}

	return betaUsers
}

// GetUserDailyQuestsAndUserIdByPublicAddress to find any quests that may
// have been completed, usually in response to a transfer event taking place.
// Returns a BetaUser partially filled out to contain the UserId and the
// daily quests.
func GetUserDailyQuestsAndUserIdByPublicAddress(address string) *BetaUser {
	postgresClient := postgres.Client()

	statementText := fmt.Sprintf(
		`SELECT
			user_id,
			daily_quest_1_address,
			daily_quest_2_address,
			daily_quest_3_address,
			daily_quest_4_address,
			daily_quest_5_address,
			daily_quest_6_address

		FROM %s
		WHERE address = $1
		`,

		TableBetaUsers,
	)

	resultRow := postgresClient.QueryRow(statementText, address)

	err := resultRow.Err()

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Context = Context

			k.Format(
				"Failed to get a user's id and their daily quests with address %#v!",
				address,
			)

			k.Payload = err
		})
	}

	var betaUser BetaUser

	err = resultRow.Scan(
		&betaUser.UserId,
		&betaUser.DailyQuest1Address,
		&betaUser.DailyQuest2Address,
		&betaUser.DailyQuest3Address,
		&betaUser.DailyQuest4Address,
		&betaUser.DailyQuest5Address,
		&betaUser.DailyQuest6Address,
	)

	if err == sql.ErrNoRows {
		return nil
	}

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Context = Context

			k.Format(
				"Failed to scan a user id and daily quests for address %#v!",
				address,
			)

			k.Payload = err
		})
	}

	return &betaUser
}

// GetUserAddressAndTicketsOrderedByTickets by partially filling
// beta.BetaUser with the address and number of tickets.
func GetUsersAddressAndTicketsOrderedByTickets(limit int) []BetaUser {
	postgresClient := postgres.Client()

	statementText := fmt.Sprintf(
		`SELECT
			address,
			tickets_scored

		FROM %s
		ORDER BY tickets_scored
		LIMIT $1
		`,

		TableBetaUsers,
	)

	resultRows, err := postgresClient.Query(
		statementText,
		limit,
	)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Context = Context
			k.Message = "Failed to query user tickets sorted by the amount!"
			k.Payload = err
		})
	}

	defer resultRows.Close()

	betaUsers := make([]BetaUser, 0)

	for resultRows.Next() {
		var betaUser BetaUser

		err := resultRows.Scan(
			&betaUser.Address,
			&betaUser.TicketsScored,
		)

		if err != nil {
			log.Fatal(func(k *log.Log) {
				k.Context = Context
				k.Message = "Failed to scan a beta user's address and ticket!"
				k.Payload = err
			})
		}

		betaUsers = append(betaUsers, betaUser)
	}

	return betaUsers
}
