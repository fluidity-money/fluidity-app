package beta

import (
	"fmt"
	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/postgres"
	"math/rand"
)

// questPoints is the inclusive max of the number of points each quest can give upon completion
// we use the range [1, n + 1) from rand.Intn
const questPoints = 5

// GetNewQuests returns 6 new random quests, to be used when
// updating a single user's daily quests
func GetNewQuests() []string {
	postgresClient := postgres.Client()

	statementText := fmt.Sprintf(`SELECT address
		FROM %s
		ORDER BY random()
		LIMIT 6`,
		TableQuests,
	)

	quests := make([]string, 6)

	rows, err := postgresClient.Query(statementText)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Message = "Failed to query new quests!"
			k.Payload = err
		})
	}

	defer rows.Close()

	for i := 0; rows.Next(); i++ {
		err := rows.Scan(&quests[i])

		if err != nil {
			log.Fatal(func(k *log.Log) {
				k.Message = "Failed to scan new quest!"
				k.Payload = err
			})
		}
	}

	return quests
}

// GetExpiredQuestUsers returns the IDs of users whose quest update timestamp has passed
func GetExpiredQuestUsers() []string {
	postgresClient := postgres.Client()

	statementText := fmt.Sprintf(
		`SELECT user_id
		FROM %[1]s
		WHERE %[1]s.daily_quest_timer < NOW()`,
		TableBetaUsers,
	)

	rows, err := postgresClient.Query(statementText)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Message = "Failed to query expired users! %s"
			k.Payload = err
		})
	}

	defer rows.Close()

	var ids []string

	for rows.Next() {
		var id string
		err := rows.Scan(&id)

		if err != nil {
			log.Fatal(func(k *log.Log) {
				k.Message = "Failed to scan user id!"
				k.Payload = err
			})
		}

		ids = append(ids, id)
	}

	return ids
}

// GetSortedUsersByQuestExpiry returns partially filled BetaUsers with IDs and timestamps of
// users whose quest update timestamp has expired, or expires soon
func GetSortedUsersByQuestExpiry() []BetaUser {
	postgresClient := postgres.Client()

	statementText := fmt.Sprintf(
		`SELECT user_id, daily_quest_timer
		FROM %s

		WHERE daily_quest_timer < NOW() + INTERVAL '1 HOUR'

		ORDER BY daily_quest_timer ASC

		`,
		TableBetaUsers,
	)

	rows, err := postgresClient.Query(statementText)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Message = "Failed to query expiring users! %s"
			k.Payload = err
		})
	}

	defer rows.Close()

	var users []BetaUser

	for rows.Next() {
		var user BetaUser

		err := rows.Scan(
			&user.UserId,
			&user.DailyQuestTimer,
		)

		if err != nil {
			log.Fatal(func(k *log.Log) {
				k.Message = "Failed to scan expiring users!"
				k.Payload = err
			})
		}

		users = append(users, user)
	}

	return users
}

// GetDailyStreakIncrement returns an increment based on the number of quests
// a user has completed in the current 24-hour iteration
func GetDailyStreakIncrement(userId string) int {
	postgresClient := postgres.Client()

	statementText := fmt.Sprintf(`SELECT
		daily_quest_1_completed,
		daily_quest_2_completed,
		daily_quest_3_completed,
		daily_quest_4_completed,
		daily_quest_5_completed,
		daily_quest_6_completed
		FROM %[1]s
		WHERE %[1]s.user_id = $1`,
		TableBetaUsers,
	)

	rows, err := postgresClient.Query(statementText, userId)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Message = "Failed to query completed quest count! %s"
			k.Payload = err
		})
	}

	defer rows.Close()

	// add between one and five for each quest that's complete
	var (
		user  BetaUser
		count = 0
	)

	if rows.Next() {
		err := rows.Scan(
			&user.DailyQuest1Completed,
			&user.DailyQuest2Completed,
			&user.DailyQuest3Completed,
			&user.DailyQuest4Completed,
			&user.DailyQuest5Completed,
			&user.DailyQuest6Completed,
		)

		if err != nil {
			log.Fatal(func(k *log.Log) {
				k.Message = "Failed to scan quest completion status!"
				k.Payload = err
			})
		}
	}

	if user.DailyQuest1Completed {
		count += rand.Intn(questPoints) + 1
	}

	if user.DailyQuest2Completed {
		count += rand.Intn(questPoints) + 1
	}

	if user.DailyQuest3Completed {
		count += rand.Intn(questPoints) + 1
	}

	if user.DailyQuest4Completed {
		count += rand.Intn(questPoints) + 1
	}

	if user.DailyQuest5Completed {
		count += rand.Intn(questPoints) + 1
	}

	if user.DailyQuest6Completed {
		count += rand.Intn(questPoints) + 1
	}

	return count
}

// UpdateUsersQuests resets the daily quests status for a user, updates
// their quest addresses, increments their tickets and updates their streak.
// Increases the amount of tickets by ticketsIncrement
func UpdateDailyQuests(userId string, ticketsIncrement int, quests ...string) {

	if lenQuests := len(quests); lenQuests != 6 {
		message := fmt.Sprintf(
			"6 quests expected in invocation to UpdateDailyQuests! %v received!",
			lenQuests,
		)

		panic(message)
	}

	postgresClient := postgres.Client()

	log.Debug(func(k *log.Log) {
		k.Message = "Updating beta user completed quests with id"
		k.Payload = userId
	})

	dailyQuestIncrement := 0

	// if the user completed a single quest, then their streak should be
	// increased

	if ticketsIncrement > 0 {
		dailyQuestIncrement = 1
	}

	statementText := fmt.Sprintf(`
		UPDATE %s SET
			daily_quest_1_completed = false,
			daily_quest_2_completed = false,
			daily_quest_3_completed = false,
			daily_quest_4_completed = false,
			daily_quest_5_completed = false,
			daily_quest_6_completed = false,

			daily_quest_1_address = $1,
			daily_quest_2_address = $2,
			daily_quest_3_address = $3,
			daily_quest_4_address = $4,
			daily_quest_5_address = $5,
			daily_quest_6_address = $6,

			daily_quest_timer = CURRENT_TIMESTAMP + INTERVAL '24 HOURS',
			daily_streak = daily_streak + $7,
			tickets_scored = tickets_scored + $8

		WHERE user_id = $9
		`,

		TableBetaUsers,
	)

	_, err := postgresClient.Exec(
		statementText,
		quests[0],
		quests[1],
		quests[2],
		quests[3],
		quests[4],
		quests[5],
		dailyQuestIncrement,
		ticketsIncrement,
		userId,
	)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Message = "Failed to execute quest update!"
			k.Payload = err
		})
	}
}

func completeDailyQuest(questNumber int, userId string) {
	postgresClient := postgres.Client()

	statementText := fmt.Sprintf(`
		UPDATE %v SET
			daily_quest_%d_completed = true

		WHERE user_id = $1
		`,

		TableBetaUsers,
		questNumber,
	)

	result, err := postgresClient.Exec(
		statementText,
		userId,
	)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Context = Context

			k.Format(
				"Failed to update daily quest %d for user id %#v!",
				questNumber,
				userId,
			)

			k.Payload = err
		})
	}

	rowsAffected, _ := result.RowsAffected()

	if rowsAffected != 1 {
		log.Fatal(func(k *log.Log) {
			k.Context = Context

			k.Format(
				"Failed to update daily quest %d for user id %#v! Rows affected was not 1! Was %d!",
				questNumber,
				userId,
				rowsAffected,
			)
		})
	}
}

func CompleteDailyQuest1(userId string) {
	completeDailyQuest(1, userId)
}

func CompleteDailyQuest2(userId string) {
	completeDailyQuest(2, userId)
}

func CompleteDailyQuest3(userId string) {
	completeDailyQuest(3, userId)
}

func CompleteDailyQuest4(userId string) {
	completeDailyQuest(4, userId)
}

func CompleteDailyQuest5(userId string) {
	completeDailyQuest(5, userId)
}

func CompleteDailyQuest6(userId string) {
	completeDailyQuest(6, userId)
}
