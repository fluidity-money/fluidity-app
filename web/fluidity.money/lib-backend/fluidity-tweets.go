// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package api_fluidity_money

import (
	"context"
	"encoding/json"
	"flag"
	"fmt"
	"net/http"

	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/web"
	twitter "github.com/g8rswimmer/go-twitter/v2"
)

// maxTweets - maximum number of latest tweets to fetch
const maxTweets = 20

type authorize struct {
	Token string
}

func (a authorize) Add(req *http.Request) {
	req.Header.Add("Authorization", fmt.Sprintf("Bearer %s", a.Token))
}

const (
	EnvTwitterToken = `FLU_TWITTER_TOKEN`

	EnvTwitterUserID = `FLU_TWITTER_USER_ID`
)

func PullTweets(w http.ResponseWriter, r *http.Request) interface{} {

	var ipAddress = web.GetIpAddress(r)

	token := flag.String("token", EnvTwitterToken, "twitter API token")
	userID := flag.String("user_id", EnvTwitterUserID, "user id")
	flag.Parse()

	client := &twitter.Client{
		Authorizer: authorize{
			Token: *token,
		},
		Client: http.DefaultClient,
		Host:   "https://api.twitter.com",
	}

	opts := UserTweetTimeLineOpts(maxTweets)

	timeline, err := client.UserTweetTimeline(context.Background(), *userID, opts)
	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Message = "user tweet timeline error"
			k.Payload = err
		})
	}

	dictionaries := timeline.Raw.TweetDictionaries()

	encode, err := json.Marshal(dictionaries)
	if err != nil {
		log.App(func(k *log.Log) {
			k.Format(
				"Failed to encode JSON response, requested from ip %v for /fluidity-tweets!",
				ipAddress,
			)
			k.Payload = err
		})

		return nil
	}

	return DecodeTwitterResponse(encode)
}
