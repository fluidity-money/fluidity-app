// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package twitter

import (
	"github.com/fluidity-money/fluidity-app/lib/util"
)

type twitterEnvResp struct {
	bearerToken string
	hashtags    []string
}

var chanTwitterRequests = make(chan chan twitterEnvResp)

func getTwitterEnvs() (bearerToken string, hashtags []string) {
	resps := make(chan twitterEnvResp)

	chanTwitterRequests <- resps

	config := <-resps

	return config.bearerToken, config.hashtags
}

func init() {
	var (
		bearerToken = util.GetEnvOrFatal(EnvTwitterBearerToken)
		hashtags_          = util.GetEnvOrFatal(EnvHashtags)
	)

	hashtags := splitHashtags(hashtags_)

	go func() {
		for request := range chanTwitterRequests {
			request <- twitterEnvResp{
				bearerToken: bearerToken,
				hashtags: hashtags,
			}
		}
	}()
}
