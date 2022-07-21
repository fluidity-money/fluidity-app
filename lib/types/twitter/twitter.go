// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE file.

package twitter

// twitter tracks accounts using twitter and their tweets

type (
	Tweet struct {
		TweeterUsername string   `json:"tweeter_username"`
		TweeterAuthorId string   `json:"tweeter_author_id"`
		TweetContent    string   `json:"tweet_content"`
		Hashtags        []string `json:"hashtags"`
		Url             string   `json:"url"`
	}

	User struct {
		Username  string `json:"username"`
		Url       string `json:"url"`
		Followers uint64 `json:"followers"`
		Following uint64 `json:"following"`
	}
)
