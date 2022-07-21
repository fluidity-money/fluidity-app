// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE file.

package main

import "strings"

func splitHashtags(hashtags_ string) []string {
	hashtags := strings.Split(hashtags_, ",")

	for i, hashtag := range hashtags {
		hashtags[i] = "#" + hashtag
	}

	return hashtags
}
