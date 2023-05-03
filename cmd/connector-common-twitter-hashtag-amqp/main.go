// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package main

import (
	commonTwitter "github.com/fluidity-money/fluidity-app/common/twitter"
	"github.com/fluidity-money/fluidity-app/lib/queue"
	"github.com/fluidity-money/fluidity-app/lib/queues/twitter"
)

func main() {
	for tweet := range commonTwitter.StreamTweets() {
		queue.SendMessage(twitter.TopicTweets, tweet)
	}
}
