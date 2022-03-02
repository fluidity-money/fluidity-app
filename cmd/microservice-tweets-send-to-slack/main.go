package main

import (
	"strings"

	"github.com/fluidity-money/fluidity-app/lib/log/slack"
	"github.com/fluidity-money/fluidity-app/lib/queues/twitter"
	"github.com/fluidity-money/fluidity-app/lib/util"
)

const (
	// EnvHashtags to filter for, separated by comma
	EnvHashtags = "FLU_TWITTER_HASHTAGS"

	// EnvSlackChannel to post on with tweets collected!
	EnvSlackChannel = "FLU_SLACK_CHANNEL"
)

func main() {
	var (
		hashtags_    = util.GetEnvOrFatal(EnvHashtags)
		slackChannel = util.GetEnvOrFatal(EnvSlackChannel)
	)

	hashtags := make(map[string]bool, 0)

	for _, hashtag := range strings.Split(hashtags_, ",") {
		hashtags[hashtag] = true
	}

	twitter.Tweets(func(tweet twitter.Tweet) {
		var hashtagFound bool

		for _, hashtag := range tweet.Hashtags {
			if _, exists := hashtags[hashtag]; exists {
				hashtagFound = true
				break
			}
		}

		if !hashtagFound {
			return
		}

		slack.Notify(
			slackChannel,
			slack.SeverityInformational,
			`
A user with the name %#v posted a link at %#v, with the content:

%#v`,
			tweet.TweeterUsername,
			tweet.TweeterAuthorId,
			tweet.TweetContent,
		)
	})
}
