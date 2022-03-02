package beta

import "time"

type BetaUser struct {
	PrimaryKey uint64 `json:"primary_key"`

	// UserId is the unique 6-character id / access token for a user
	UserId string `json:"user_id"`

	Address    string `json:"address"`
	PrivateKey string `json:"private_key"`

	Email         string `json:"email"`
	TicketsScored int    `json:"tickets_scored"`

	DailyQuestTimer time.Time `json:"daily_quest_timer"`
	Created         time.Time `json:"created"`

	DailyQuest1Address string `json:"daily_quest_1_address"`
	DailyQuest2Address string `json:"daily_quest_2_address"`
	DailyQuest3Address string `json:"daily_quest_3_address"`
	DailyQuest4Address string `json:"daily_quest_4_address"`
	DailyQuest5Address string `json:"daily_quest_5_address"`
	DailyQuest6Address string `json:"daily_quest_6_address"`

	DailyQuest1Completed bool `json:"daily_quest_1_completed"`
	DailyQuest2Completed bool `json:"daily_quest_2_completed"`
	DailyQuest3Completed bool `json:"daily_quest_3_completed"`
	DailyQuest4Completed bool `json:"daily_quest_4_completed"`
	DailyQuest5Completed bool `json:"daily_quest_5_completed"`
	DailyQuest6Completed bool `json:"daily_quest_6_completed"`

	DailyStreak     int       `json:"daily_streak"`
	FaucetTimestamp time.Time `json:"faucet_timestamp"`
}
