// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE file.

package main

import "github.com/fluidity-money/fluidity-app/lib/web"

func main() {
	web.JsonEndpoint("/api/request-unique-phrase", HandleUniquePhrase)

	web.JsonEndpoint("/api/submit-question", HandleSubmitQuestion)

	notFoundHandler := MakeNotFoundErrorHandler()

	web.Endpoint("/", notFoundHandler)

	web.Listen()
}
