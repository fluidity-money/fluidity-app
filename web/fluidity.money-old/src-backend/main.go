// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package main

import (
	"github.com/fluidity-money/fluidity-app/lib/util"
	"github.com/fluidity-money/fluidity-app/lib/web"
)

// EnvSuccessUrl to send the users to when they complete the endpoints
const EnvSuccessUrl = "FLU_LANDING_SUCCESS_URL"

func main() {
	successUrl := util.GetEnvOrFatal(EnvSuccessUrl)

	submitQuestionHandler := MakeHandleSubscribe(successUrl)

	web.Endpoint("/api/submit-email", submitQuestionHandler)

	askQuestionHandler := MakeHandleAskQuestion(successUrl)

	web.Endpoint("/api/ask-question", askQuestionHandler)

	web.Endpoint("/", HandleRedirect)

	web.Endpoint("/#success", HandleRedirect)

	web.Listen()
}
