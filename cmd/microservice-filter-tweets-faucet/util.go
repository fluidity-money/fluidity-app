package main

import (
	"math"
	"regexp"
	"strings"

	"github.com/fluidity-money/fluidity-app/lib/types/twitter"
)

var (
	regexpAddress = regexp.MustCompile("(^|[ .!/:;\n])([0-9A-Za-z]){32}([ .!:/;\n]|$)")
	regexpHashtag = regexp.MustCompile("#(solana|ethereum)")
)

func tweetContainsHashtag(tweet twitter.Tweet, hashtags ...string) bool {

	for _, hashtag_ := range tweet.Hashtags {
		hashtag := strings.ToLower(hashtag_)

		for _, otherHashtag := range hashtags {
			if hashtag == otherHashtag {
				return true
			}
		}
	}

	return false
}

func tweetContainsUniqueAddress(tweet twitter.Tweet) string {
	address := regexpAddress.FindString(tweet.TweetContent)

	if len(address) == 0 {
		return ""
	}

	actualAddress := strings.Trim(address, " .!/:;\n")

	return actualAddress
}

func tweetContainsNetworkHashtag(tweet twitter.Tweet) string {
	str := regexpHashtag.FindString(tweet.TweetContent)
	return strings.TrimPrefix(str, "#")
}

func floatAsInt64(x float64) int64 {
	float := math.RoundToEven(x)

	return int64(float)
}
