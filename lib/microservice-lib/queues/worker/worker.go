package worker

// contains queue code specific to the current implementation of the worker

import (
	"github.com/fluidity-money/fluidity-app/lib/queue"
	"github.com/fluidity-money/fluidity-app/lib/types/worker"
)

const TopicAnnouncements = "worker.announcements"

type Announcement = worker.Announcement

func Announcements(f func(Announcement)) {
	queue.GetMessages(TopicAnnouncements, func(message queue.Message) {

		var announcement Announcement

		message.Decode(&announcement)

		f(announcement)
	})
}
