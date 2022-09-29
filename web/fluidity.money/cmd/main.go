// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package main

import (
	"github.com/fluidity-money/fluidity-app/lib/web"

	api_fluidity_money "github.com/fluidity-money/fluidity-app/web/fluidity.money/lib-backend"
)

func main() {
	web.JsonEndpoint("/fluidity-tweets", api_fluidity_money.PullTweets)
	web.Listen()
}
