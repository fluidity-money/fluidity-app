// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package twitter

// Context used for logging
const Context = "TWITTER"

const (
	// EnvTwitterBearerToken to use to authenticate with Twitter
	EnvTwitterBearerToken = `FLU_TWITTER_BEARER_TOKEN`

	// EnvHashtags to pass to Twitter streams to start to stream
	EnvHashtags = `FLU_TWITTER_HASHTAGS`
)
