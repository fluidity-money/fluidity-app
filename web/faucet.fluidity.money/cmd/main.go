package main

import "github.com/fluidity-money/fluidity-app/lib/web"

func main() {
	web.JsonEndpoint("/api/request-unique-phrase", HandleUniquePhrase)

	web.JsonEndpoint("/api/submit-question", HandleSubmitQuestion)

	notFoundHandler := MakeNotFoundErrorHandler()

	web.Endpoint("/", notFoundHandler)

	web.Listen()
}
