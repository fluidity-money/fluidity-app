package beta

import "github.com/fluidity-money/fluidity-app/lib/queue"

func DailyQuestsCompleted(f func(completedQuest BetaCompletedQuest)) {
	queue.GetMessages(TopicBetaDailyQuestCompleted, func(message queue.Message) {
		var	completedQuest BetaCompletedQuest

		message.Decode(&completedQuest)

		f(completedQuest)
	})
}
