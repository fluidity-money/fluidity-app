package beta

import "time"

const (
	QuestPosition1 = iota + 1
	QuestPosition2
	QuestPosition3
	QuestPosition4
	QuestPosition5
	QuestPosition6
)

// BetaCompletedQuest that's distributed via queue to be placed into the
// database and used to notify a client and the database for an update
type BetaCompletedQuest struct {
	BetaUserUserId   string    `json:"beta_user_user_id"`
	RecipientAddress string    `json:"recipient_address"`
	QuestPosition    int       `json:"quest_position"`
	Time             time.Time `json:"time"`
}
