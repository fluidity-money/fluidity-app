package main

import (
	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/queue"
	"github.com/fluidity-money/fluidity-app/lib/queues/twitter"
	"github.com/fluidity-money/fluidity-app/lib/util"

	"github.com/fluidity-money/fluidity-app/cmd/connector-common-twitter-hashtag-amqp/lib"
)

const (
	// EnvTwitterBearerToken to use to authenticate with Twitter
	EnvTwitterBearerToken = `FLU_TWITTER_BEARER_TOKEN`

	// EnvHashtags to pass to Twitter streams to start to stream
	EnvHashtags = `FLU_TWITTER_HASHTAGS`
)

func main() {
	var (
		twitterBearerToken = util.GetEnvOrFatal(EnvTwitterBearerToken)
		hashtags_          = util.GetEnvOrFatal(EnvHashtags)
	)

	hashtags := splitHashtags(hashtags_)

	log.Debug(func(k *log.Log) {
		k.Format(
			"Starting to stream for the hashtags %#v!",
			hashtags,
		)
	})

	tweets, errors, err := connector_common_twitter_fluidity_hashtag_amqp.RunStreamTweets(
		twitterBearerToken,
		hashtags...,
	)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Message = "Failed to start streaming tweets!"
			k.Payload = err
		})
	}

	for {
		select {
		case tweet := <-tweets:
			queue.SendMessage(twitter.TopicTweets, tweet)

		case err := <-errors:
			log.Fatal(func(k *log.Log) {
				k.Format("Error streaming tweets! %v", err)
			})
		}
	}
}
