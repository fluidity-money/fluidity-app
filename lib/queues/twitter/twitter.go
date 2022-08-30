// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package twitter

// twitter contains queues for tracking tweets

import (
	"github.com/fluidity-money/fluidity-app/lib/queue"
	"github.com/fluidity-money/fluidity-app/lib/types/twitter"
)

// TopicTweets contains tweets that are seen by us
const TopicTweets = "twitter.tweets"

type (
	Tweet = twitter.Tweet
	User  = twitter.User
)

func Tweets(f func(tweet Tweet)) {
	queue.GetMessages(TopicTweets, func(m queue.Message) {
		var tweet Tweet

		m.Decode(&tweet)

		f(tweet)
	})
}
