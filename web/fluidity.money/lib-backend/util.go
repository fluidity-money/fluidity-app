// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package api_fluidity_money

import (
	"encoding/json"

	twitter "github.com/g8rswimmer/go-twitter/v2"
)

func UserTweetTimeLineOpts(size int) twitter.UserTweetTimelineOpts {
	return twitter.UserTweetTimelineOpts{
		TweetFields: []twitter.TweetField{twitter.TweetFieldCreatedAt, twitter.TweetFieldAuthorID, twitter.TweetFieldConversationID, twitter.TweetFieldPublicMetrics, twitter.TweetFieldContextAnnotations},
		UserFields:  []twitter.UserField{twitter.UserFieldUserName},
		Expansions:  []twitter.Expansion{twitter.ExpansionAuthorID},
		MaxResults:  size,
	}
}

func DecodeTwitterResponse(res []byte) interface{} {
	var jsonMap map[string]interface{}
	json.Unmarshal([]byte(string(res)), &jsonMap)
	return jsonMap
}
