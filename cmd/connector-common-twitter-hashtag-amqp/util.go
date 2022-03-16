package main

import "strings"

func splitHashtags(hashtags_ string) []string {
	hashtags := strings.Split(hashtags_, ",")

	for i, hashtag := range hashtags {
		hashtags[i] = "#" + hashtag
	}

	return hashtags
}
